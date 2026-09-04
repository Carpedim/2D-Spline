function calcularPontos() {
    let pontos = [];
    let pontosT;
    document.addEventListener('click', function(event) {
        if (animacaoID !== undefined) {
            cancelAnimationFrame(animacaoID);
            animacaoID = undefined;
        }
        const x = event.pageX;
        const y = event.pageY;
        let ponto = {
            x: x,
            y: y
        };
        pontos.push(ponto);
        if (pontos.length <2) {
        pontosT=pontos 
        desenhar(pontosT, pontos);
        }else {
            pontosT=catmullRom(pontos);
            animacaoID = requestAnimationFrame((timestamp) => {
                animar(pontosT, pontos, timestamp);
            });
        }
    });
}

function catmullRom(pontos) {
    let pontosT = [];
    let pontosAlt = [...pontos];
    pontosAlt.unshift(pontos[0]);
    pontosAlt.push(pontos[pontos.length-1]);
    for (let i=0; i<pontosAlt.length-3; ++i) {
        for (let j=0; j<=100; ++j){
        let t=j/100;
        let ponto = {
            x: (0.5 * (2*pontosAlt[i+1].x + (-pontosAlt[i].x + pontosAlt[i+2].x)*t + (2*pontosAlt[i].x - 5*pontosAlt[i+1].x + 4*pontosAlt[i+2].x - pontosAlt[i+3].x)*t**2 + (-pontosAlt[i].x + 3*pontosAlt[i+1].x - 3*pontosAlt[i+2].x + pontosAlt[i+3].x)*t**3)),
            y: (0.5 * (2*pontosAlt[i+1].y + (-pontosAlt[i].y + pontosAlt[i+2].y)*t + (2*pontosAlt[i].y - 5*pontosAlt[i+1].y + 4*pontosAlt[i+2].y - pontosAlt[i+3].y)*t**2 + (-pontosAlt[i].y + 3*pontosAlt[i+1].y - 3*pontosAlt[i+2].y + pontosAlt[i+3].y)*t**3))
        }
        pontosT.push(ponto);
        }
    }
    return pontosT;
}

function desenhar(pt, pontos) {
    const canvas = document.getElementById("visual");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const contexto = canvas.getContext("2d");

    if (pt.length < 2) {
        contexto.beginPath();
        contexto.arc(pt[0].x, pt[0].y, 5, 0, 2 * Math.PI);
        contexto.fill();
    }else {
        contexto.beginPath();
        contexto.strokeStyle = 'blue';
        contexto.lineWidth = 2.5;
        contexto.moveTo(pt[0].x, pt[0].y);
        for (let i=0; i<pt.length-1; i++){
            contexto.lineTo(pt[i+1].x, pt[i+1].y);
        }
        contexto.stroke();
        contexto.beginPath();
        contexto.arc(pontos[0].x, pontos[0].y, 5, 0, 2 * Math.PI);
        contexto.fill();
        for (let i=0; i<pontos.length-1; i++){
            contexto.beginPath();
            contexto.arc(pontos[i+1].x, pontos[i+1].y, 5, 0, 2 * Math.PI);
            contexto.fill();
        }
    }
}

function animar(pt, pontos, timestamp, tempoInicial) {
    const canvas = document.getElementById("visual");
    const contexto = canvas.getContext("2d");
    if (tempoInicial === undefined) {
        tempoInicial = timestamp;
    }
    let tempoAtual = timestamp - tempoInicial;
    desenhar(pt, pontos)
    let dA = calcularDistancia(pt);
    let distanciaTotal = dA[dA.length-1];
    let distanciaAlvo = 500*(tempoAtual/1000);
    console.log("tempo:", tempoAtual / 1000, "distancia:", distanciaAlvo);
    if (distanciaAlvo > distanciaTotal) {
        distanciaAlvo = distanciaTotal;
    }
    let {i, f} = descobrirLoc(dA, distanciaAlvo);
    let x = pt[i].x + f * (pt[i + 1].x - pt[i].x);
    let y = pt[i].y + f * (pt[i + 1].y - pt[i].y);
    contexto.beginPath();
    contexto.fillStyle = 'red';
    contexto.arc(x, y, 10, 0, 2 * Math.PI);
    contexto.fill();
    if(distanciaAlvo < distanciaTotal) {
        animacaoID = requestAnimationFrame((timestamp) => {
            animar(pt, pontos, timestamp, tempoInicial);
        });
    } else {
        animacaoID = undefined;
    }
}

function calcularDistancia(pt) {
    let d = 0;
    let dA = [0];
    for (let i=0; i<pt.length-1; ++i) {
        d += Math.sqrt((pt[i+1].x - pt[i].x)**2 + (pt[i+1].y - pt[i].y)**2);
        dA.push(d);
    }
    return dA;
}

function descobrirLoc(dA, distanciaAlvo) {
    let f;
    let i;
    for (i=0; i<=dA.length-2; ++i){
        if (dA[i] <= distanciaAlvo && dA[i+1] >= distanciaAlvo){
            f = ((distanciaAlvo - dA[i]) / (dA[i+1] - dA[i]))
            break;
        }
    }
    return {i, f};
}

let animacaoID;
calcularPontos();