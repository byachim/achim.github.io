// text animation
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!@#$%¨&*()´~[]_+-';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 13); // Ajustado para um intervalo menor
      const end = start + Math.floor(Math.random() * 13); // Ajustado para um intervalo menor
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        // Se o caractere for um espaço em branco, exiba-o normalmente, caso contrário, adicione-o dentro de uma tag span
        output += (to === ' ' ? ' ' : `<span class="dud">${char}</span>`);
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

const phrases = [
  'OH,',
  "A NEW DISCOVER IS COMING,",
  "TILL SOON."
];

const el = document.querySelector('.text');
const fx = new TextScramble(el);

let counter = 0;
const next = () => {
  fx.setText(phrases[counter]).then(() => {
    let timeoutDuration = 1000; // Intervalo de espera reduzido
    if (counter === phrases.length - 1) {
      timeoutDuration = 3000; // Intervalo de espera reduzido
    }
    setTimeout(() => {
      counter = (counter + 1) % phrases.length;
      next(); // Chamada de next sem atraso adicional
    }, timeoutDuration);
  });
};

next();

document.querySelectorAll('.popup').forEach(popup => {
  popup.fx = new TextScramble(popup);
});

// Função para iniciar o deslocamento com base em uma largura estimada maior
function initiateShift(item) {
  let popup = item.querySelector('.popup');
  if (popup) {
    let estimatedWidth = Math.min(300, Math.max(120, popup.textContent.length * 10));
    let nextSiblings = getNextSiblings(item);

    nextSiblings.forEach(sib => {
      sib.style.transform = `translateX(${estimatedWidth + 15}px)`;
    });
  }
}

document.querySelectorAll('.social-icon').forEach(item => {
  item.addEventListener('mouseenter', event => {
    initiateShift(item);

    const popup = item.querySelector('.popup');
    if (popup) {
      popup.fx.setText(popup.textContent || '');
    }
  });

  item.addEventListener('mouseleave', event => {
    let nextSiblings = getNextSiblings(item);
    nextSiblings.forEach(sib => {
      sib.style.transform = `translateX(0px)`;
    });
  });
});

// Função para obter todos os irmãos seguintes
function getNextSiblings(elem) {
  let siblings = [];
  while (elem = elem.nextSibling) {
    if (elem.nodeType === 1) {
      siblings.push(elem);
    }
  }
  return siblings;
}
