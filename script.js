document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Smooth Scrolling para Links Internos
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 2. Cronômetro de Escassez (24h Persistente)
    // ==========================================
    const HOURS_KEY = 'kit_ia_timer_hours';
    const MINUTES_KEY = 'kit_ia_timer_minutes';
    const SECONDS_KEY = 'kit_ia_timer_seconds';
    const LAST_TIME_KEY = 'kit_ia_timer_last_timestamp';

    let hours = parseInt(localStorage.getItem(HOURS_KEY)) || 23;
    let minutes = parseInt(localStorage.getItem(MINUTES_KEY)) || 59;
    let seconds = parseInt(localStorage.getItem(SECONDS_KEY)) || 59;
    let lastTimestamp = localStorage.getItem(LAST_TIME_KEY);

    const now = Date.now();

    // Se já existia um timer registrado, calcular a diferença decorrida enquanto a aba esteve fechada
    if (lastTimestamp) {
        const timeDiff = Math.floor((now - parseInt(lastTimestamp)) / 1000);
        if (timeDiff > 0) {
            let totalSeconds = (hours * 3600) + (minutes * 60) + seconds - timeDiff;
            
            if (totalSeconds <= 0) {
                // Reinicia o cronômetro para 23h 59m se o tempo expirou (estratégia de urgência contínua)
                hours = 23;
                minutes = 59;
                seconds = 59;
            } else {
                hours = Math.floor(totalSeconds / 3600);
                minutes = Math.floor((totalSeconds % 3600) / 60);
                seconds = totalSeconds % 60;
            }
        }
    }

    const timerHoursEl = document.getElementById('timer-hours');
    const timerMinutesEl = document.getElementById('timer-minutes');
    const timerSecondsEl = document.getElementById('timer-seconds');

    function updateTimerDisplay() {
        if (timerHoursEl) timerHoursEl.textContent = String(hours).padStart(2, '0');
        if (timerMinutesEl) timerMinutesEl.textContent = String(minutes).padStart(2, '0');
        if (timerSecondsEl) timerSecondsEl.textContent = String(seconds).padStart(2, '0');
    }

    const timerInterval = setInterval(() => {
        if (seconds > 0) {
            seconds--;
        } else {
            if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else {
                if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else {
                    // Reset inteligente ao zerar
                    hours = 23;
                    minutes = 59;
                    seconds = 59;
                }
            }
        }

        // Salvar estado localmente
        localStorage.setItem(HOURS_KEY, hours);
        localStorage.setItem(MINUTES_KEY, minutes);
        localStorage.setItem(SECONDS_KEY, seconds);
        localStorage.setItem(LAST_TIME_KEY, Date.now());

        updateTimerDisplay();
    }, 1000);

    updateTimerDisplay();

    // ==========================================
    // 3. Simulador de Landing Pages por Nicho
    // ==========================================
    const tabs = document.querySelectorAll('.niche-tab');
    const simulatedLps = document.querySelectorAll('.simulated-lp');
    const urlSlugEl = document.getElementById('browser-url-slug');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const niche = tab.getAttribute('data-niche');
            
            // Alterar aba ativa
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Alterar modelo de LP exibido
            simulatedLps.forEach(lp => lp.classList.remove('active'));
            const targetLp = document.getElementById(`lp-${niche}`);
            if (targetLp) targetLp.classList.add('active');
            
            // Atualizar URL simulada
            if (urlSlugEl) urlSlugEl.textContent = niche;
            
            // Auto-scroll no simulador para simular interação
            const viewport = document.getElementById('browser-viewport');
            if (viewport) {
                viewport.scrollTop = 0;
            }
        });
    });

    // ==========================================
    // 4. Simulador do Terminal de Prompts
    // ==========================================
    const termTabs = document.querySelectorAll('.terminal-tab-btn');
    const termContents = document.querySelectorAll('.terminal-content');

    termTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            
            termTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            termContents.forEach(content => {
                content.style.display = 'none';
            });
            
            const targetContent = document.getElementById(`content-term-${category}`);
            if (targetContent) targetContent.style.display = 'block';
        });
    });

    // Cópia de Prompts com Feedback Visual
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const copyId = btn.getAttribute('data-copy-id');
            const textEl = document.getElementById(copyId);
            
            if (textEl) {
                try {
                    await navigator.clipboard.writeText(textEl.textContent.trim());
                    
                    // Feedback visual temporário
                    const span = btn.querySelector('span');
                    const originalText = span.textContent;
                    span.textContent = 'Copiado!';
                    btn.style.background = 'var(--success)';
                    btn.style.color = '#fff';
                    
                    setTimeout(() => {
                        span.textContent = originalText;
                        btn.style.background = '';
                        btn.style.color = '';
                    }, 2000);
                } catch (err) {
                    console.error('Falha ao copiar texto: ', err);
                }
            }
        });
    });

    // ==========================================
    // 5. FAQ Accordion (Perguntas Frequentes)
    // ==========================================
    const faqCards = document.querySelectorAll('.faq-card');

    faqCards.forEach(card => {
        const trigger = card.querySelector('.faq-trigger');
        trigger.addEventListener('click', () => {
            const isOpen = card.classList.contains('open');
            
            // Fechar todos
            faqCards.forEach(c => c.classList.remove('open'));
            
            // Se não estava aberto, abrir o atual
            if (!isOpen) {
                card.classList.add('open');
            }
        });
    });

    // ==========================================
    // 6. Calculadora de Preço (Checkout + Order Bump)
    // ==========================================
    const orderBumpCheck = document.getElementById('order-bump-check');
    const displayedPrice = document.getElementById('displayed-price');
    const displayedInstallments = document.getElementById('displayed-installments');

    const BASE_PRICE = 47.00;
    const BUMP_PRICE = 19.90;

    function updatePrice() {
        if (!displayedPrice || !displayedInstallments) return;

        if (orderBumpCheck && orderBumpCheck.checked) {
            const total = BASE_PRICE + BUMP_PRICE;
            // Formatando valor
            displayedPrice.textContent = total.toFixed(2).replace('.', ',');
            displayedInstallments.textContent = `ou 5x de R$ 14,00 no cartão de crédito`;
        } else {
            displayedPrice.textContent = BASE_PRICE.toFixed(2).replace('.', ',');
            displayedInstallments.textContent = `ou 5x de R$ 10,00 no cartão de crédito`;
        }
    }

    if (orderBumpCheck) {
        orderBumpCheck.addEventListener('change', updatePrice);
    }

    // ==========================================
    // 7. Validação Segura e Redirecionamento de Leads
    // ==========================================
    const leadForm = document.getElementById('lead-secure-form');
    const btnSubmit = document.getElementById('btn-submit-checkout');

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 1. Obter e higienizar os inputs contra injeção básica de scripts (Mapeado para ser 100% seguro no client-side)
            const nameInput = document.getElementById('lead-name').value.trim();
            const emailInput = document.getElementById('lead-email').value.trim();
            const phoneInput = document.getElementById('lead-phone').value.trim();

            const sanitizedName = nameInput.replace(/[<>]/g, ''); 
            const sanitizedEmail = emailInput.replace(/[<>]/g, '');
            const sanitizedPhone = phoneInput.replace(/[^0-9()+\-\s]/g, ''); // Apenas números e símbolos de telefone

            // Validações básicas de email e telefone
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(sanitizedEmail)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }

            if (sanitizedPhone.length < 8) {
                alert('Por favor, insira um número de WhatsApp válido.');
                return;
            }

            // Desabilitar botão para evitar cliques duplicados
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.textContent = 'Processando com segurança...';
            }

            // 2. Definir Links de Checkout Oficiais da Kiwify (Sem chaves do backend no frontend!)
            // Nota de Segurança: A url de redirecionamento é construída no lado do cliente apenas com parâmetros públicos de preenchimento de formulário.
            // Para Kiwify, os parâmetros suportados no redirecionamento para preenchimento automático são:
            // - name: Nome completo do cliente
            // - email: E-mail do cliente
            // - phone: Número de WhatsApp do cliente
            const checkoutBaseUrl = 'https://pay.kiwify.com.br/XXXXXXX'; // Substitua pelo link de checkout simples do seu produto Kiwify
            const checkoutBumpUrl = 'https://pay.kiwify.com.br/YYYYYYY'; // Substitua pelo link de checkout Kiwify com o Order Bump selecionado
            
            let finalCheckoutUrl = orderBumpCheck && orderBumpCheck.checked ? checkoutBumpUrl : checkoutBaseUrl;

            // Adicionar dados do cliente como parâmetros de consulta públicos (dados de preenchimento)
            const urlParams = new URLSearchParams();
            urlParams.append('name', sanitizedName);
            urlParams.append('email', sanitizedEmail);
            urlParams.append('phone', sanitizedPhone);
            urlParams.append('src', 'pagina-vendas-kit-ia');

            const separator = finalCheckoutUrl.includes('?') ? '&' : '?';
            const redirectUrl = `${finalCheckoutUrl}${separator}${urlParams.toString()}`;

            // Exemplo de como integrar uma captura silenciosa (Sem expor credenciais):
            /*
            fetch('https://formspree.io/f/seu-id-formulario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: sanitizedName, email: sanitizedEmail, phone: sanitizedPhone, orderBump: orderBumpCheck.checked })
            }).finally(() => {
                window.location.href = redirectUrl;
            });
            */
            
            // Simulação de redirecionamento imediato e seguro
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1000);
        });
    }

    // ==========================================
    // 8. Prova Social Dinâmica (Notificações Pop-up)
    // ==========================================
    const firstNames = ['Gabriel', 'Lucas', 'Thiago', 'Matheus', 'Felipe', 'Bruno', 'Rodrigo', 'Aline', 'Fernanda', 'Mariana', 'Carla', 'Patricia', 'Juliana', 'Renata'];
    const lastInitials = ['S.', 'M.', 'L.', 'F.', 'A.', 'R.', 'C.', 'O.', 'G.', 'P.'];
    const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre', 'Salvador', 'Fortaleza', 'Brasília', 'Campinas', 'Goiânia'];
    const niches = ['Landing Page Advogado', 'Landing Page Estética', 'Landing Page Dentista', 'Kit IA Completo', 'Landing Page Corretor'];

    const toastContainer = document.getElementById('toast-notification-container');

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function createSocialToast() {
        if (!toastContainer) return;

        const name = `${getRandomItem(firstNames)} ${getRandomItem(lastInitials)}`;
        const city = getRandomItem(cities);
        const product = getRandomItem(niches);
        const initials = name.split(' ').map(n => n[0]).join('');

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-avatar">${initials}</div>
            <div class="toast-content">
                <strong>${name} (${city})</strong>
                <span>Adquiriu o modelo: <em>${product}</em></span>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Animar entrada
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Animar saída e remover
        setTimeout(() => {
            toast.classList.remove('show');
            // Esperar animação terminar antes de excluir
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 5000);
    }

    // Disparar primeiro toast após 5 segundos
    setTimeout(() => {
        createSocialToast();
        
        // Loop infinito a cada 15 a 25 segundos
        setInterval(() => {
            createSocialToast();
        }, Math.floor(Math.random() * 10000) + 15000);

    }, 5000);

});
