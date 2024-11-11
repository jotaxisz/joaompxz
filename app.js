const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

// Inicializando o Puppeteer com o caminho do Chrome
puppeteer.launch({
  executablePath: '/path/to/your/chrome' // Substitua pelo caminho correto do seu Chrome
}).then(browser => {
  console.log('Chrome launched successfully');

const bot = new Client({
    authStrategy: new LocalAuth()
});

client.initialize();

const horaAbertura = 8;
const horaFechamento = 19;
let ultVisita = null;
let ultGarantia = null;

let esperandoInicio = true;
let aguardandoOpcao = false;
let aguardandoInfoVisita = false;
let aguardandoInfoGarantia = false;
let aguardandoOpcaoProd = false;
let etapaDadosFornecidosVisita = 0;
let etapaDadosFornecidosGarantia = 0;
let dadosCliente = {};
let dadosGarantia = {};
let ultInteracao = null;

bot.on('ready', () => {
    console.log('Bot on!');
});

bot.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

bot.on('message', async msg => {
    const chat = await msg.getChat();

    if (msg.fromMe || msg.isStatus || chat.isGroup) {
        console.log("Mensagem recebida de um bot ou grupo, ignorando...");
        return;
    }

    const agora = new Date();
    const tsMsg = new Date(msg.timestamp * 1000);
    const diff = (agora - tsMsg) / 1000;

    if (diff > 10) {
        console.log("Mensagem antiga detectada, ignorando...");
        return;
    }

    let texto = msg.body.toLowerCase().trim();
    console.log("Mensagem recebida: " + texto);

    const horaAtual = agora.getHours();

    let msgForaHorario = '';
    if (horaAtual < horaAbertura || horaAtual >= horaFechamento) {
        msgForaHorario = `\n\nComo as lojas estão fechadas, pode haver uma demora para atendê-lo, mas retornaremos assim que possível.`;
    }

    if (!aguardandoInfoVisita && !aguardandoInfoGarantia && ultVisita && (agora - ultVisita) < 3 * 60 * 1000) {
        console.log("Interação recente detectada, ignorando...");
        /*setTimeout(async () => {
            await msg.reply("Você já solicitou um atendimento recentemente. Aguarde 3 minutos antes de fazer outra solicitação.");
        }, 1000);*/
        return;
    }

    if (texto.includes("oi")) {
        esperandoInicio = false;
        aguardandoOpcao = true;
        aguardandoInfoVisita = false;
        aguardandoInfoGarantia = false;
        aguardandoOpcaoProd = false;
        etapaDadosFornecidosVisita = 0;
        etapaDadosFornecidosGarantia = 0;

        const resposta = `Olá, sou o assistente virtual da MP Xavier! No que posso te ajudar?${msgForaHorario}\n\n` +
            `1️⃣ Venda de peças\n` +
            `2️⃣ Venda de produtos\n` +
            `3️⃣ Falar com atendente\n` +
            `4️⃣ Solicitar visita técnica\n` +
            `5️⃣ Garantia`;
        setTimeout(async () => {
            await msg.reply(resposta);
        }, 1000);
        return;
    }

    if (aguardandoOpcao) { // Opções do começo
        if (['1', '2', '3', '4', '5'].includes(texto)) {
            aguardandoOpcao = false;

            if (texto === '1') {
                setTimeout(async () => {
                    await msg.reply("Para comprar peças, ligue para o número 2734-1881.");
                }, 1000);
            }

            else if (texto === '2') {
                aguardandoOpcaoProd = true;
                const menuProd = `O que deseja comprar?\n\n` +
                    `1️⃣ Refrigeradores\n` +
                    `2️⃣ Geladeiras\n` +
                    `3️⃣ Microondas\n` +
                    `4️⃣ Ar-condicionado\n` +
                    `5️⃣ Voltar`;
                setTimeout(async () => {
                    await msg.reply(menuProd);
                }, 1000);
            }

            else if (texto === '3') {
                setTimeout(async () => {
                    await msg.reply("Um de nossos atendentes irá te ajudar em breve. \nEnquanto isso, descreva o problema com seu equipamento ou serviço que deseja contratar.");
                }, 1000);
            }

            else if (texto === '4') {
                aguardandoInfoVisita = true;
                etapaDadosFornecidosVisita = 1;
                ultVisita = agora;
                setTimeout(async () => {
                    await msg.reply("Para solicitar a visita técnica, por favor informe seu *nome completo*.");
                }, 1000);
            }

            else if (texto === '5') {
                aguardandoInfoGarantia = true;
                etapaDadosFornecidosGarantia = 1;
                ultGarantia = agora;
                setTimeout(async () => {
                    await msg.reply("Para solicitar a garantia, por favor informe seu *nome completo*.");
                }, 1000);
            }
        }

        else {
            setTimeout(async () => {
                await msg.reply("Escolha uma opção válida (1 a 4) ou digite *Oi* para recomeçar.");
            }, 1000);
        }
        return;
    }

    if (aguardandoOpcaoProd) { // Venda de produtos
        if (['1', '2', '3', '4', '5'].includes(texto)) {
            aguardandoOpcaoProd = false;

            if (texto === '1') {
                setTimeout(async () => {
                    await msg.reply("Configurando isso ainda..");
                }, 1000);
            }

            else if (texto === '2') {
                setTimeout(async () => {
                    await msg.reply("Configurando isso ainda..");
                }, 1000);
            }

            else if (texto === '3') {
                setTimeout(async () => {
                    await msg.reply("Configurando isso ainda..");
                }, 1000);
            }

            else if (texto === '4') {
                setTimeout(async () => {
                    await msg.reply("Configurando isso ainda..");
                }, 1000);
            }

            else if (texto === '5') {
                aguardandoOpcao = true;
                const resposta = `No que posso te ajudar?${msgForaHorario}\n\n` +
                    `1️⃣ Venda de peças\n` +
                    `2️⃣ Venda de produtos\n` +
                    `3️⃣ Falar com atendente\n` +
                    `4️⃣ Solicitar visita técnica\n`;
                setTimeout(async () => {
                    await msg.reply(resposta);
                }, 1000);
            }
        }

        else {
            setTimeout(async () => {
                await msg.reply("Escolha uma opção válida (1 a 5) ou digite *Oi* para recomeçar.");
            }, 1000);
        }
        return;
    }

    if (aguardandoInfoVisita) { // Solicitação de visita
        if (etapaDadosFornecidosVisita === 1) {
            dadosCliente.nome = texto;
            etapaDadosFornecidosVisita = 2;
            setTimeout(async () => {
                await msg.reply("Agora, por favor, informe seu CPF (somente números).");
            }, 1000);
        }

        else if (etapaDadosFornecidosVisita === 2) {
            if (validarCPF(texto)) {
                dadosCliente.cpf = formatarCPF(texto);
                etapaDadosFornecidosVisita = 3;
                setTimeout(async () => {
                    await msg.reply("Informe seu telefone para contato (somente números).");
                }, 1000);
            } else {
                setTimeout(async () => {
                    await msg.reply("CPF inválido. Por favor, informe seu CPF (somente números).");
                }, 1000);
            }
        }

        else if (etapaDadosFornecidosVisita === 3) {
            if (validarTelefone(texto)) {
                dadosCliente.telefone = formatarTelefone(texto);
                etapaDadosFornecidosVisita = 4;
                setTimeout(async () => {
                    await msg.reply("Agora, informe o endereço completo (incluindo bairro e ponto de referência).");
                }, 1000);
            } else {
                setTimeout(async () => {
                    await msg.reply("Telefone inválido. Informe seu telefone para contato (somente números).");
                }, 1000);
            }
        }

        else if (etapaDadosFornecidosVisita === 4) {
            dadosCliente.endereco = texto;
            etapaDadosFornecidosVisita = 5;
            setTimeout(async () => {
                await msg.reply("Por fim, informe o melhor horário para atendimento.");
            }, 1000);
        }

        else if (etapaDadosFornecidosVisita === 5) {
            dadosCliente.horario = texto;
            ultInteracao = new Date();

            const desktopPath = 'C:\\Users\\marco\\Desktop';
            const filePath = path.join(desktopPath, `Visita - ${dadosCliente.nome}.txt`);
            await salvardadosClienteente(dadosCliente, filePath);

            setTimeout(async () => {
                await msg.reply(`A visita foi agendada com sucesso para ${dadosCliente.horario}!\n\n` +
                    `Detalhes:\n` +
                    `Nome: ${dadosCliente.nome}\n` +
                    `CPF: ${dadosCliente.cpf}\n` +
                    `Telefone: ${dadosCliente.telefone}\n` +
                    `Endereço: ${dadosCliente.endereco}\n\n` +
                    `Aguarde que entraremos em contato o mais breve possível!`);
                aguardandoInfoVisita = false;
            }, 1000);
        }
        return;
    }

    // Solicitação de garantia
    if (etapaDadosFornecidosGarantia === 1) {
        dadosGarantia.nome = texto;
        etapaDadosFornecidosGarantia = 2;
        setTimeout(async () => {
            await msg.reply("Agora, por favor, informe seu CPF (somente números).");
        }, 1000);
    }

    else if (etapaDadosFornecidosGarantia === 2) {
        if (validarCPF(texto)) {
            dadosGarantia.cpf = formatarCPF(texto);
            etapaDadosFornecidosGarantia = 3;
            setTimeout(async () => {
                await msg.reply("Informe o nome da pessoa que devemos procurar.");
            }, 1000);
        } else {
            setTimeout(async () => {
                await msg.reply("CPF inválido. Por favor, informe seu CPF (somente os 11 números).");
            }, 1000);
        }
    }

    else if (etapaDadosFornecidosGarantia === 3) {
        dadosGarantia.procurarPor = texto;
        etapaDadosFornecidosGarantia = 4;
        setTimeout(async () => {
            await msg.reply("Informe seu telefone para contato (somente números com DDD).");
        }, 1000);
    }

    else if (etapaDadosFornecidosGarantia === 4) {
        if (validarTelefone(texto)) {
            dadosGarantia.telefone = formatarTelefone(texto);
            etapaDadosFornecidosGarantia = 5;
            setTimeout(async () => {
                await msg.reply("Agora, informe o nome da rua e o número da casa.");
            }, 1000);
        } else {
            setTimeout(async () => {
                await msg.reply("Telefone inválido. Informe seu telefone para contato (somente números).");
            }, 1000);
        }
    }

    else if (etapaDadosFornecidosGarantia === 5) {
        dadosGarantia.endereco = texto;
        etapaDadosFornecidosGarantia = 6;
        setTimeout(async () => {
            await msg.reply("Informe o bairro.");
        }, 1000);
    }

    else if (etapaDadosFornecidosGarantia === 6) {
        dadosGarantia.bairro = texto;
        etapaDadosFornecidosGarantia = 7;
        setTimeout(async () => {
            await msg.reply("Informe a cidade.");
        }, 1000);
    }

    else if (etapaDadosFornecidosGarantia === 7) {
        dadosGarantia.cidade = texto;
        etapaDadosFornecidosGarantia = 8;
        setTimeout(async () => {
            await msg.reply("Informe as referências do endereço.");
        }, 1000);
    }

    else if (etapaDadosFornecidosGarantia === 8) {
        dadosGarantia.referencias = texto;
        etapaDadosFornecidosGarantia = 9;
        setTimeout(async () => {
            await msg.reply("Informe o produto.");
        }, 1000);
    }

    else if (etapaDadosFornecidosGarantia === 9) {
        dadosGarantia.produto = texto;
        etapaDadosFornecidosGarantia = 10;
        setTimeout(async () => {
            await msg.reply("Informe o modelo do aparelho.");
        }, 1000);
    }

    else if (etapaDadosFornecidosGarantia === 10) {
        dadosGarantia.modelo = texto;
        etapaDadosFornecidosGarantia = 11;
        setTimeout(async () => {
            await msg.reply("Descreva a reclamação do produto.");
        }, 1000);
    }

    else if (etapaDadosFornecidosGarantia === 11) {
        dadosGarantia.reclamacao = texto;
        etapaDadosFornecidosGarantia = 12;
        ultInteracao = new Date();

        const desktopPath = 'C:\\Users\\marco\\Desktop';
        const filePath = path.join(desktopPath, `${dadosGarantia.nome} - ${dadosGarantia.telefone}.txt`);
        await salvarDadosGarantia(dadosGarantia, filePath);

        setTimeout(async () => {
            await msg.reply(`A solicitação de garantia foi registrada com sucesso!\n\n` +
                `Detalhes:\n` +
                `Nome: ${dadosGarantia.nome}\n` +
                `CPF: ${dadosGarantia.cpf}\n` +
                `Procurar por: ${dadosGarantia.procurarPor}\n` +
                `Telefone: ${dadosGarantia.telefone}\n` +
                `Endereço: ${dadosGarantia.endereco}\n` +
                `Bairro: ${dadosGarantia.bairro}\n` +
                `Cidade: ${dadosGarantia.cidade}\n` +
                `Referências: ${dadosGarantia.referencias}\n` +
                `Produto: ${dadosGarantia.produto}\n` +
                `Modelo: ${dadosGarantia.modelo}\n` +
                `Reclamação: ${dadosGarantia.reclamacao}\n\n` +
                `Aguarde que entraremos em contato o mais breve possível!\nEm quanto isso nos envie uma foto do produto com defeito e tambem a foto da nota fiscal.`);
            aguardandoInfoGarantia = false;
        }, 1000);
    }
});

function validarCPF(cpf) {
    if (cpf.length !== 11 || isNaN(cpf)) {
        return false;
    }

    return true;
}

function formatarCPF(cpf) {
    return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9, 11)}`;
}

function validarTelefone(telefone) {
    if (telefone.length < 10 || telefone.length > 11 || isNaN(telefone)) {
        return false;
    }
    return true;
}

function formatarTelefone(telefone) {
    if (telefone.length === 11) {
        return `(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7)}`;
    } else {
        return `(${telefone.substring(0, 2)}) ${telefone.substring(2, 6)}-${telefone.substring(6)}`;
    }
}

async function salvardadosClienteente(dados, arquivo) {
    const dadosFormatados = `Nome: ${dados.nome}\nCPF: ${dados.cpf}\nTelefone: ${dados.telefone}\nEndereço: ${dados.endereco}\nHorário: ${dados.horario}\n\n`;
    fs.appendFileSync(arquivo, dadosFormatados);
}
async function salvarDadosGarantia(dados, arquivo) {
    const dadosFormatados = `Nome: ${dados.nome}\nCPF: ${dados.cpf}\nProcurar por: ${dados.procurarPor}\nTelefone: ${dados.telefone}\nEndereço: ${dados.endereco}\nBairro: ${dados.bairro}\nCidade: ${dados.cidade}\nReferências: ${dados.referencias}\nProduto: ${dados.produto}\nModelo: ${dados.modelo}\nReclamação: ${dados.reclamacao}\n\n`;
    fs.appendFileSync(arquivo, dadosFormatados);
}

bot.initialize();
