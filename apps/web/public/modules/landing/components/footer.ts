export const Footer = (): HTMLElement => {
  const footer = document.createElement("footer");
  footer.className = "landing-footer";

  footer.innerHTML = `
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-brand">
            <span class="footer-logo">Farma<span class="brand-accent">PROX</span></span>
          </div>
          <p class="footer-description">
            Sua saúde é nossa prioridade. Oferecemos as melhores soluções 
            farmacêuticas com tecnologia e cuidado humanizado.
          </p>
          <div class="footer-social">
            <a href="#" class="social-link" title="Website">
              <span class="material-symbols-outlined">public</span>
            </a>
            <a href="#" class="social-link" title="Email">
              <span class="material-symbols-outlined">mail</span>
            </a>
            <a href="#" class="social-link" title="Chat">
              <span class="material-symbols-outlined">chat</span>
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">Sobre nós</h4>
          <ul class="footer-links">
            <li><a href="#">Nossa História</a></li>
            <li><a href="#">Trabalhe Conosco</a></li>
            <li><a href="#">Política de Privacidade</a></li>
            <li><a href="#">Termos de Uso</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">Ajuda</h4>
          <ul class="footer-links">
            <li><a href="#">Meus Pedidos</a></li>
            <li><a href="#">Trocas e Devoluções</a></li>
            <li><a href="#">Prazos de Entrega</a></li>
            <li><a href="#">Perguntas Frequentes</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">Contato</h4>
          <ul class="footer-contact">
            <li class="contact-item">
              <span class="material-symbols-outlined contact-icon">location_on</span>
              <span>Av. Paulista, 1000 - Bela Vista, São Paulo - SP</span>
            </li>
            <li class="contact-item">
              <span class="material-symbols-outlined contact-icon">call</span>
              <span>0800 123 4567</span>
            </li>
            <li class="contact-item">
              <span class="material-symbols-outlined contact-icon">schedule</span>
              <span>Seg - Sex: 08h às 22h</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">
          © 2024 FarmaPROX. Todos os direitos reservados. 
          Razão Social: FarmaPROX S.A. | CNPJ: 00.000.000/0001-00
        </p>
        <div class="footer-payments">
          <span class="material-symbols-outlined">credit_card</span>
          <span class="material-symbols-outlined">payments</span>
          <span class="material-symbols-outlined">account_balance_wallet</span>
        </div>
      </div>
    </div>
  `;

  return footer;
};
