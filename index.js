window.addEventListener('load', () => {
  const META = 3000000;

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

          document.getElementById('progressbar-wait').style.width = pledged >= META ? '0%' : `${(waiting + pledged) >= META ? calcPercent(META - pledged) : calcPercent(waiting)}%`;
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

  setInterval(() => {
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

            document.getElementById('progressbar-wait').style.width = pledged >= META ? '0%' : `${(waiting + pledged) >= META ? calcPercent(META - pledged) : calcPercent(waiting)}%`;
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
  }, 10000);
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

function calcPercent(number = 0, total = 3000000) {
  return (number * 100) / total;
}


// Detalhes do Projeto:
// https://api.catarse.me/project_details?project_id=eq.122021

// Detalhes de Recompensa:
// https://api.catarse.me/reward_details?project_id=eq.122021