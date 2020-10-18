window.addEventListener('load', () => {
  const META_1 = 500000;
  const PERC_META_1 = calcPercent(META_1);
  const META_2 = 600000;
  const PERC_META_2 = calcPercent(META_2);
  const META_3 = 700000;
  const PERC_META_3 = calcPercent(META_3);
  const META_4 = 800000;
  const PERC_META_4 = calcPercent(META_4);
  const META_5 = 1000000;
  const PERC_META_5 = calcPercent(META_5);
  const META_6 = 1200000;
  const PERC_META_6 = calcPercent(META_6);

  axios.get('https://api.catarse.me/project_details?project_id=eq.122021')
    .then((projectRes) => {
      let data = projectRes.data[0];
      let pledged = data.pledged;

      document.getElementById('progressbar-conf').style.width = `${calcPercent(pledged)}%`;
      document.getElementById('pledged').innerHTML = `${formatMoney(pledged)}`;

      axios.get('https://api.catarse.me/reward_details?project_id=eq.122021')
        .then((detailsRes) => {
          let data = detailsRes.data;
          let waiting = 0;

          data.forEach((d) => {
            let minimum = d.minimum_value;
            let wait = d.waiting_payment_count;

            waiting += minimum * wait;
          });

          let total = pledged + waiting;

          document.getElementById('waiting').innerHTML = `${formatMoney(waiting)}`;
          document.getElementById('total-value').innerHTML = `${formatMoney(total)}`;
        })
        .catch((error) => {
          console.log(error);
        });

    })
    .catch((error) => {
      console.log(error);
    });
});

function formatMoney(number = 0, prefix = true) {
  try {
    return prefix
      ?
      number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2, minimumFractionDigits: 2 }).includes(',')
        ? number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2, minimumFractionDigits: 2 })
        : `${number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2, minimumFractionDigits: 2 })},00`
      :
      number.toLocaleString('pt-BR', { currency: 'BRL', maximumFractionDigits: 2, minimumFractionDigits: 2 }).includes(',')
        ? number.toLocaleString('pt-BR', { currency: 'BRL', maximumFractionDigits: 2, minimumFractionDigits: 2 })
        : `${number.toLocaleString('pt-BR', { currency: 'BRL', maximumFractionDigits: 2, minimumFractionDigits: 2 })},00`
  } catch {
    return `${'0'.toLocaleString('pt-BR', { currency: 'BRL', maximumFractionDigits: 2, minimumFractionDigits: 2 })
      },00`
  }
}

function calcPercent(number = 0, total = 1200000) {
  return (number * 100) / total;
}


// Detalhes do Projeto:
// https://api.catarse.me/project_details?project_id=eq.122021

// Detalhes de Recompensa:
// https://api.catarse.me/reward_details?project_id=eq.122021