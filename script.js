document.addEventListener("DOMContentLoaded", function () {
    // Array para armazenar valores diários
    const valoresDiarios = [];

    // Opções para o flatpickr
    const flatpickrOptions = {
        dateFormat: "d-m-Y",  // Formato da data
        onClose: function (selectedDates, dateStr) {
            const selectedDate = flatpickrInstance.selectedDates[0];

            if (selectedDate) {
                const diaSelecionado = selectedDate.getDate();
                const mesSelecionado = selectedDate.getMonth() + 1; // Observe que os meses são base 0
                const anoSelecionado = selectedDate.getFullYear();

                // Atualize os campos de dia, mês e ano (você pode adicionar IDs apropriados)
                document.getElementById('diaSelecionado').value = diaSelecionado;
                document.getElementById('mesSelecionado').value = mesSelecionado;
                document.getElementById('anoSelecionado').value = anoSelecionado;
            }
        }
    };

    // Inicialize o flatpickr na caixa de seleção rápida
    const flatpickrInstance = flatpickr(".flatpickr", flatpickrOptions);

    // Função para adicionar valor diário
    function adicionarValorDiario() {
        const valorDiario = parseFloat(document.getElementById('valorDiario').value);
        const diaSelecionado = parseInt(document.getElementById('diaSelecionado').value);
        const anoSelecionado = parseInt(document.getElementById('anoSelecionado').value);

        // Validar entrada de dados
        if (isNaN(valorDiario) || isNaN(diaSelecionado) || isNaN(anoSelecionado) || diaSelecionado < 1 || diaSelecionado > 31) {
            alert("Por favor, insira valores válidos.");
            return;
        }

        // Adicionar o valor diário ao array
        valoresDiarios.push({ dia: diaSelecionado, ano: anoSelecionado, valor: valorDiario });

        // Atualizar gráfico diário
        atualizarGraficoDiario(valoresDiarios);

        // Atualizar gráfico semanal
        atualizarGraficoSemanal(valoresDiarios);

        // Atualizar gráfico mensal
        atualizarGraficoMensal(valoresDiarios);
    }

    // Resto do seu código
});

// Rótulos dos meses
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// Função para atualizar o gráfico de rosca de dificuldades
function atualizarGraficoDificuldades() {
    const dificuldadesData = {
        labels: ['Falta de Confiança', 'Resistência do Cliente', 'Negociações Complexas', 'Concorrência Intensa', 'Outros'],
        datasets: [{
            data: [
                document.getElementById('faltaDeConfianca').value,
                document.getElementById('resistenciaCliente').value,
                document.getElementById('negociacoesComplexas').value,
                document.getElementById('concorrenciaIntensa').value,
                document.getElementById('outros').value,
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }],
    };

    // Obtenha o gráfico de rosca de dificuldades
    const dificuldadesCtx = document.getElementById('dificuldadesGrafico').getContext('2d');

    // Verifique se o gráfico já existe e atualize-o ou crie um novo
    if (window.dificuldadesChart) {
        window.dificuldadesChart.data = dificuldadesData;
        window.dificuldadesChart.update();
    } else {
        window.dificuldadesChart = new Chart(dificuldadesCtx, {
            type: 'doughnut',
            data: dificuldadesData,
        });
    }
}

// Função para atualizar o gráfico de pizza de categorias
function atualizarGraficoCategorias() {
    const categoriasData = {
        labels: ['Categoria A', 'Categoria B', 'Categoria C'],
        datasets: [{
            data: [
                document.getElementById('categoriaA').value,
                document.getElementById('categoriaB').value,
                document.getElementById('categoriaC').value,
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }],
    };

    // Obtenha o gráfico de pizza de categorias
    const categoriasCtx = document.getElementById('negociacoesCategoriaChart').getContext('2d');

    // Verifique se o gráfico já existe e atualize-o ou crie um novo
    if (window.categoriasChart) {
        window.categoriasChart.data = categoriasData;
        window.categoriasChart.update();
    } else {
        window.categoriasChart = new Chart(categoriasCtx, {
            type: 'pie',
            data: categoriasData,
        });
    }
}

// Chame as funções de atualização dos gráficos quando a página carregar
atualizarGraficoDificuldades();
atualizarGraficoCategorias();

const dataEvolucao = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    datasets: [
        {
            label: 'Média de Recovery',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        },
        {
            label: 'Média de Cura',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
    ],
};

const evolucaoCtx = document.getElementById('evolucao-chart').getContext('2d');

const evolucaoConfig = {
    type: 'line',
    data: dataEvolucao,
    options: {
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
                max: 100,
            },
        },
    },
};

const evolucaoChart = new Chart(evolucaoCtx, evolucaoConfig);

document.getElementById('adicionar-cura').addEventListener('click', () => {
    const mes = document.getElementById('mes-selecionado').value;
    const media = document.getElementById('cura-media').value;

    if (mes && media && !isNaN(media)) {
        dataEvolucao.labels.push(mes);
        dataEvolucao.datasets[1].data.push(parseFloat(media));
        evolucaoChart.update();

        // Salvar os dados no armazenamento local
        salvarDadosEvolucao(dataEvolucao);
    }
});

document.getElementById('adicionar-recovery').addEventListener('click', () => {
    const mes = document.getElementById('mes-selecionado').value;
    const media = document.getElementById('recovery-media').value;

    if (mes && media && !isNaN(media)) {
        dataEvolucao.labels.push(mes);
        dataEvolucao.datasets[0].data.push(parseFloat(media));
        evolucaoChart.update();

        // Salvar os dados no armazenamento local
        salvarDadosEvolucao(dataEvolucao);
    }
});

// Função para salvar os dados de evolução no armazenamento local
function salvarDadosEvolucao(data) {
    localStorage.setItem('dados_evolucao', JSON.stringify(data));
}

// Função para carregar os dados salvos no armazenamento local
function carregarDadosEvolucao() {
    const dadosSalvos = localStorage.getItem('dados_evolucao');
    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        dataEvolucao.labels = dados.labels;
        dataEvolucao.datasets[0].data = dados.datasets[0].data;
        dataEvolucao.datasets[1].data = dados.datasets[1].data;
        evolucaoChart.update();
    }
}

carregarDadosEvolucao(); // Carregamos os dados ao iniciar a página
