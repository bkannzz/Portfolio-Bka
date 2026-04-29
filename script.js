function enviarWhats(event) { /* função para enviar mensagem pelo WhatsApp */
    event.preventDefault(); /* faz com que o formulário não seja enviado normalmente */

    const nome = document.getElementById('nome').value;
    const mensagem = document.getElementById('mensagem').value;
    const telefone = "5511981996311";

    const texto = `Olá! Me chamo ${nome}, ${mensagem}`;
    const msgFormatada = encodeURIComponent(texto);
    const assunto = encodeURIComponent(texto);
    const url = `https://wa.me/${telefone}/?text=${msgFormatada}`;

    window.open(url, '_blank');
}

function animarSkills() {
    const barras = document.querySelectorAll('.barras > span');

    barras.forEach(barra => { /* forEach = para cada barra */
        barra.style.animation = 'none'; // remove animação
        barra.offsetHeight; // força o navegador a recalcular tudo naquele momento
        barra.style.animation = ''; // reaplica animação do CSS
    });
}