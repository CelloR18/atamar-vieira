document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // CONFIGURAÇÃO DA SENHA
  // ==========================================

  const SENHA_CORRETA = "alunostibiriça220026";
  const CHAVE_ACESSO = "acessoSimuladosLiberado";

  // ==========================================
  // ELEMENTOS DA TELA DE LOGIN
  // ==========================================

  const accessGate = document.getElementById("accessGate");
  const accessForm = document.getElementById("accessForm");
  const accessPassword = document.getElementById("accessPassword");
  const accessError = document.getElementById("accessError");
  const togglePassword = document.getElementById("togglePassword");

  // ==========================================
  // LIBERAR ACESSO
  // ==========================================

  function liberarAcesso() {
    if (accessGate) {
      accessGate.classList.add("is-hidden");
    }

    document.body.classList.remove("access-locked");

    const loadingScreen = document.getElementById("loadingScreen");

    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.style.opacity = "0";
        loadingScreen.style.pointerEvents = "none";

        setTimeout(() => {
          loadingScreen.style.display = "none";
        }, 500);
      }, 800);
    }
  }

  // Verifica se o usuário já informou a senha nesta aba
  if (sessionStorage.getItem(CHAVE_ACESSO) === "true") {
    liberarAcesso();
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

      const senhaDigitada = accessPassword
        ? accessPassword.value.trim()
        : "";

      if (senhaDigitada === SENHA_CORRETA) {
        sessionStorage.setItem(CHAVE_ACESSO, "true");

        if (accessError) {
          accessError.textContent = "";
        }

        liberarAcesso();
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

      accessPassword.type = senhaEstaVisivel
        ? "password"
        : "text";

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
  // PESQUISA DOS SIMULADOS
  // ==========================================

  const searchInput = document.getElementById("searchInput");
  const cards = document.querySelectorAll(".simulado-card");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const value = searchInput.value
        .toLowerCase()
        .trim();

      cards.forEach((card) => {
        const name = card.dataset.name
          ? card.dataset.name.toLowerCase()
          : "";

        card.style.display = name.includes(value)
          ? ""
          : "none";
      });
    });
  }

  // ==========================================
  // INSTALAÇÃO DO APLICATIVO
  // ==========================================

  let deferredPrompt = null;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
  });

  const installButtons = [
    document.getElementById("installBtn"),
    document.getElementById("installBtnHero")
  ];

  installButtons.forEach((button) => {
    if (!button) {
      return;
    }

    button.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();

        try {
          await deferredPrompt.userChoice;
        } catch (error) {
          console.error(
            "Não foi possível abrir a instalação:",
            error
          );
        }

        deferredPrompt = null;
      } else {
        alert(
          "Para instalar no iPhone, toque em Compartilhar e depois em Adicionar à Tela de Início."
        );
      }
    });
  });

  // ==========================================
  // SERVICE WORKER
  // ==========================================

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("service-worker.js")
        .catch((error) => {
          console.warn(
            "Service Worker não registrado:",
            error
          );
        });
    });
  }
});