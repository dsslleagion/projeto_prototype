// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener("DOMContentLoaded", () => {
    
    // Seleciona o formulário pelo ID "formCadastro"
    const form = document.getElementById("formCadastro");
    
    // Seleciona o parágrafo ou elemento que mostrará mensagens para o usuário
    const mensagem = document.getElementById("mensagem");
    
    // Seleciona a lista onde os usuários cadastrados serão exibidos
    const lista = document.getElementById("listaUsuarios");

    // Adiciona um evento de envio ao formulário
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evita que a página seja recarregada ao enviar o formulário

        // Cria um objeto FormData com os dados preenchidos no formulário
        const formData = new FormData(form);

        // Envia os dados do formulário para o backend via fetch, usando método POST
        const response = await fetch("/usuarios", {
            method: "POST",
            body: formData
        });

        // Converte a resposta do backend para JSON
        const data = await response.json();

        // Verifica se a criação do usuário foi bem-sucedida
        if (data.status === "ok") {
            // Exibe uma mensagem de sucesso
            mensagem.textContent = "✅ Usuário cadastrado com sucesso!";
            
            // Limpa os campos do formulário
            form.reset();
            
            // Atualiza a lista de usuários exibida
            carregarUsuarios();
        } else {
            // Exibe mensagem de erro se algo deu errado
            mensagem.textContent = "❌ Erro ao cadastrar usuário!";
        }
    });

    // Função para buscar e exibir os usuários cadastrados no backend
async function carregarUsuarios() {
    const response = await fetch("/usuarios");
    const usuarios = await response.json();
    lista.innerHTML = "";

    usuarios.forEach(u => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${u.nome} – ${u.email}
            <button class="editar" data-id="${u.id}">✏️ Editar</button>
            <button class="excluir" data-id="${u.id}">🗑️ Excluir</button>
        `;
        lista.appendChild(li);
    });

    // Adiciona eventos aos botões de edição
    document.querySelectorAll(".editar").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const id = e.target.dataset.id;
            const novoNome = prompt("Novo nome:");
            const novoEmail = prompt("Novo email:");
            if (!novoNome || !novoEmail) {
                alert("Preencha nome e email!");
                return;
            }

            // Faz requisição PUT
            const response = await fetch(`/usuarios/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: novoNome,
                    email: novoEmail
                })
            });

            if (response.ok) {
                mensagem.textContent = "✅ Usuário atualizado com sucesso!";
                carregarUsuarios();
            } else {
                mensagem.textContent = "❌ Erro ao atualizar usuário!";
            }
        });
    });

    // Adiciona eventos aos botões de exclusão
    document.querySelectorAll(".excluir").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const id = e.target.dataset.id;
            if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

            const response = await fetch(`/usuarios/${id}`, { method: "DELETE" });

            if (response.ok) {
                mensagem.textContent = "🗑️ Usuário excluído com sucesso!";
                carregarUsuarios();
            } else {
                mensagem.textContent = "❌ Erro ao excluir usuário!";
            }
        });
    });
}
    // Chama a função ao carregar a página para exibir os usuários existentes
    carregarUsuarios();
});
