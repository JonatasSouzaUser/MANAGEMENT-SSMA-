document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const formData = new FormData(event.target); // Captura os dados do formulário
    const data = Object.fromEntries(formData); // Converte os dados para um objeto

    try {
        const response = await fetch('http://localhost:3000/users/register', {
            method: 'POST', // Método de envio
            headers: {
                'Content-Type': 'application/json' // Tipo de conteúdo
            },
            body: JSON.stringify(data) // Converte o objeto em JSON
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error.message); // Exibe mensagem de erro se não for 200
        } else {
            alert('Cadastro realizado com sucesso!'); // Exibe mensagem de sucesso
            // Aqui você pode redirecionar para a página de login
            window.location.href = 'login.html'; // Redireciona para a página de login
        }
    } catch (error) {
        console.error('Erro ao realizar cadastro:', error);
        alert('Erro ao realizar cadastro. Tente novamente.'); // Mensagem de erro geral
    }
});
