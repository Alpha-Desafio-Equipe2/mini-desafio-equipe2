// Lógica exclusiva da tela de login

function inicializarLogin() {
    const form = document.getElementById('form-login');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = (document.getElementById('email') as HTMLInputElement).value;
            const senha = (document.getElementById('senha') as HTMLInputElement).value;

            // Aqui você faria a chamada real à API (fetch)
            if (email === 'admin@farma.com' && senha === '123456') {
                // Simula login bem sucedido
                // Salva token se necessário: localStorage.setItem('token', '...');
                
                // Redireciona para o painel principal
                window.location.href = 'index.html';
            } else {
                alert('E-mail ou senha inválidos!');
            }
        });
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', inicializarLogin);