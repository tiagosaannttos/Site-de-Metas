document.addEventListener("DOMContentLoaded", function () {
    const inputTarefa = document.getElementById("inputTarefa");
    const listaTarefas = document.getElementById("listaTarefas");
    const mensagem = document.getElementById("mensagem");
    const toggleModo = document.getElementById("toggleModo");
    const btnVoz = document.getElementById("btnVoz");
    const btnAdicionar = document.getElementById("btnAdicionar");
    const reconhecimento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    // 🔹 Carregar tarefas salvas ao abrir o site
    function carregarTarefas() {
        const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas")) || [];
        tarefasSalvas.forEach(tarefa => adicionarTarefaDOM(tarefa.texto, tarefa.concluida, tarefa.prazo));
    }

    // 🔹 Salvar tarefas no LocalStorage
    function salvarTarefas() {
        const tarefas = [];
        document.querySelectorAll("#listaTarefas li").forEach(tarefa => {
            tarefas.push({
                texto: tarefa.querySelector("span").textContent,
                concluida: tarefa.querySelector("span").classList.contains("concluida"),
                prazo: tarefa.querySelector(".prazo").value
            });
        });
        localStorage.setItem("tarefas", JSON.stringify(tarefas));
    }

    // 🔹 Adicionar tarefa no HTML e LocalStorage
    function adicionarTarefa() {
        let tarefaTexto = inputTarefa.value.trim();
        if (tarefaTexto === "") {
            mensagem.textContent = "Por favor, digite uma tarefa!";
            return;
        }
        adicionarTarefaDOM(tarefaTexto, false, "");
        salvarTarefas();
        mensagem.textContent = "Tarefa adicionada com sucesso!";
        inputTarefa.value = "";
    }

    // 🔹 Adicionar tarefa ao DOM
    function adicionarTarefaDOM(texto, concluida, prazoValor) {
        let novaTarefa = document.createElement("li");
        let textoTarefa = document.createElement("span");
        textoTarefa.textContent = texto;

        if (concluida) {
            textoTarefa.classList.add("concluida");
        }

        let prazo = document.createElement("input");
        prazo.type = "date";
        prazo.classList.add("prazo");
        prazo.value = prazoValor;

        let botaoRemover = document.createElement("button");
        botaoRemover.textContent = "Remover";
        botaoRemover.classList.add("remover");

        // 🔹 Remover tarefa e atualizar o LocalStorage
        botaoRemover.onclick = function () {
            novaTarefa.style.opacity = "0";
            novaTarefa.style.transform = "scale(0.9)";
            setTimeout(() => {
                listaTarefas.removeChild(novaTarefa);
                salvarTarefas();
            }, 300);
        };

        // 🔹 Marcar tarefa como concluída
        textoTarefa.onclick = function () {
            textoTarefa.classList.toggle("concluida");
            salvarTarefas();
        };

        // 🔹 Atualizar LocalStorage ao modificar prazo
        prazo.addEventListener("change", salvarTarefas);

        novaTarefa.appendChild(textoTarefa);
        novaTarefa.appendChild(prazo);
        novaTarefa.appendChild(botaoRemover);
        listaTarefas.appendChild(novaTarefa);
    }

    // 🔹 Alternar modo escuro e salvar no LocalStorage
    toggleModo.addEventListener("click", function () {
        document.body.classList.toggle("modo-escuro");
        toggleModo.textContent = document.body.classList.contains("modo-escuro") ? "☀️ Modo Claro" : "🌙 Modo Escuro";
        localStorage.setItem("modoEscuro", document.body.classList.contains("modo-escuro"));
    });

    // 🔹 Manter modo escuro ativado caso já esteja salvo
    if (localStorage.getItem("modoEscuro") === "true") {
        document.body.classList.add("modo-escuro");
        toggleModo.textContent = "☀️ Modo Claro";
    }

    // 🔹 Ativar reconhecimento de voz para adicionar tarefa
    btnVoz.addEventListener("click", function () {
        reconhecimento.start();
    });

    reconhecimento.onresult = function (event) {
        const transcricao = event.results[0][0].transcript;
        inputTarefa.value = transcricao;
    };

    // 🔹 Carregar as tarefas ao abrir o site
    carregarTarefas();

    // 🔹 Adicionar evento ao botão
    btnAdicionar.addEventListener("click", adicionarTarefa);
});


    
    
