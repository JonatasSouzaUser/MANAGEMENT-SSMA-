document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita o comportamento padrão de recarregar a página

    const formData = {
        username: event.target.username.value,
        password: event.target.password.value
    };

    try {
        const response = await fetch('/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            // Exibe o token no console para verificar se está sendo retornado corretamente
            console.log('Token:', result.token);
            
            // Agora redireciona para a página central (dashboard) usando o window.location
            if (result.redirect) {
                window.location.href = result.redirect;
            } else {
                alert("Erro no redirecionamento.");
            }
        } else {
            alert(result.message); // Exibe a mensagem de erro
        }
    } catch (error) {
        console.error('Erro no login:', error);
        alert('Erro ao tentar fazer login.');
    }
});
