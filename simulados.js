document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // CONFIGURAÇÃO DA SENHA (MANTIDA INTACTA)
  // ==========================================

  const SENHA_CORRETA = "alunos181293#";
  const CHAVE_ACESSO = "acessoSimuladosLiberado";

  // ==========================================
  // ELEMENTOS DA TELA DE LOGIN
  // ==========================================

  const accessGate = document.getElementById("accessGate");
  const accessForm = document.getElementById("accessForm");
  const accessPassword = document.getElementById("accessPassword");
  const accessError = document.getElementById("accessError");
  const togglePassword = document.getElementById("togglePassword");
  const loadingScreen = document.getElementById("loadingScreen");

  // ==========================================
  // LIBERAR ACESSO (COM CARREGAMENTO INTELIGENTE)
  // ==========================================

  function liberarAcesso(imediato = false) {
    if (accessGate) {
      accessGate.classList.add("is-hidden");
    }

    document.body.classList.remove("access-locked");

    if (loadingScreen) {
      if (imediato) {
        loadingScreen.style.display = "none";
      } else {
        setTimeout(() => {
          loadingScreen.style.opacity = "0";
          loadingScreen.style.pointerEvents = "none";

          setTimeout(() => {
            loadingScreen.style.display = "none";
          }, 400);
        }, 500);
      }
    }
  }

  // Verifica se o usuário já autenticou nesta aba
  if (sessionStorage.getItem(CHAVE_ACESSO) === "true") {
    liberarAcesso(true);
  } else {
    if (accessGate) {
      accessGate.classList.remove("is-hidden");
    }

    document.body.classList.add("access-locked");

    if (accessPassword) {
      setTimeout(() => {
        accessPassword.focus();
      }, 300);
    }
  }

  // ==========================================
  // VALIDAR SENHA
  // ==========================================

  if (accessForm) {
    accessForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const senhaDigitada = accessPassword ? accessPassword.value.trim() : "";

      if (senhaDigitada === SENHA_CORRETA) {
        sessionStorage.setItem(CHAVE_ACESSO, "true");

        if (accessError) {
          accessError.textContent = "";
        }

        liberarAcesso(false);
      } else {
        if (accessError) {
          accessError.textContent = "Senha incorreta. Tente novamente.";
        }

        if (accessPassword) {
          accessPassword.value = "";
          accessPassword.focus();
        }
      }
    });
  }

  // ==========================================
  // MOSTRAR OU ESCONDER SENHA
  // ==========================================

  if (togglePassword && accessPassword) {
    togglePassword.addEventListener("click", () => {
      const senhaEstaVisivel = accessPassword.type === "text";

      accessPassword.type = senhaEstaVisivel ? "password" : "text";

      const icon = togglePassword.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-eye", senhaEstaVisivel);
        icon.classList.toggle("fa-eye-slash", !senhaEstaVisivel);
      }

      togglePassword.setAttribute(
        "aria-label",
        senhaEstaVisivel ? "Mostrar senha" : "Ocultar senha"
      );
    });
  }

  // ==========================================
  // PESQUISA INTELIGENTE (SEM ACENTOS & MULTIFONTE)
  // ==========================================

  const searchInput = document.getElementById("searchInput");
  const simuladosGrid = document.getElementById("simuladosGrid");
  const cards = document.querySelectorAll(".simulado-card");

  // Remove acentos e converte para minúsculas
  function normalizarTexto(texto) {
    return (texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  // Cria elemento de "Nenhum resultado" se não existir
  let noResultsEl = document.getElementById("noResultsMessage");
  if (!noResultsEl && simuladosGrid) {
    noResultsEl = document.createElement("div");
    noResultsEl.id = "noResultsMessage";
    noResultsEl.style.display = "none";
    noResultsEl.style.gridColumn = "1 / -1";
    noResultsEl.style.textAlign = "center";
    noResultsEl.style.padding = "3rem 1rem";
    noResultsEl.style.color = "#475569";
    noResultsEl.innerHTML = `
      <i class="fas fa-search" style="font-size: 2.2rem; margin-bottom: 0.8rem; color: #94a3b8; display: block;"></i>
      <h3 style="font-size: 1.25rem; margin-bottom: 0.4rem; color: #0a356b;">Nenhum simulado encontrado</h3>
      <p style="font-size: 0.95rem;">Tente buscar por outro número ou palavra-chave.</p>
    `;
    simuladosGrid.appendChild(noResultsEl);
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const termoBusca = normalizarTexto(searchInput.value);
      let encontrados = 0;

      cards.forEach((card) => {
        const dataName = card.dataset.name || "";
        const titleText = card.querySelector("h3") ? card.querySelector("h3").textContent : "";
        const combinedText = normalizarTexto(`${dataName} ${titleText}`);

        const combina = combinedText.includes(termoBusca);
        card.style.display = combina ? "" : "none";

        if (combina) encontrados++;
      });

      if (noResultsEl) {
        noResultsEl.style.display = encontrados === 0 ? "block" : "none";
      }
    });

    // Tecla ESC limpa a pesquisa
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input"));
        searchInput.blur();
      }
    });
  }

  // ==========================================
  // INSTALAÇÃO DO APLICATIVO (PWA ROBUSTO)
  // ==========================================

  let deferredPrompt = null;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
  });

  const installButtons = [
    document.getElementById("installBtn"),
    document.getElementById("installBtnHero")
  ].filter(Boolean);

  const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  const isStandalone = window.navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches;

  // Se já estiver rodando instalado, esconde os botões de instalação
  if (isStandalone) {
    installButtons.forEach((btn) => (btn.style.display = "none"));
  }

  installButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();

        try {
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === "accepted") {
            installButtons.forEach((btn) => (btn.style.display = "none"));
          }
        } catch (error) {
          console.error("Erro ao solicitar instalação PWA:", error);
        }

        deferredPrompt = null;
      } else if (isIos) {
        alert(
          "Para instalar no iPhone/iPad:\n1. Toque no botão 'Compartilhar' do Safari (quadrado com seta).\n2. Selecione 'Adicionar à Tela de Início'."
        );
      } else {
        alert(
          "O aplicativo já está instalado ou seu navegador não suporta a instalação direta."
        );
      }
    });
  });

  window.addEventListener("appinstalled", () => {
    installButtons.forEach((btn) => (btn.style.display = "none"));
    deferredPrompt = null;
  });

  // ==========================================
  // REGISTRO DO SERVICE WORKER
  // ==========================================

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("service-worker.js")
        .catch((error) => {
          console.warn("Service Worker não registrado:", error);
        });
    });
  }
});