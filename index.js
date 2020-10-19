const META = 1200000;

window.addEventListener('load', () => {

  loadInfosAndChangeHTML();

});

async function loadInfosAndChangeHTML() {

  let pledged = await getPledgedValueAsync();
  updatePledgedHTMLVaule(pledged);

  let waiting = await getWaitingValueAsync();
  updateWaitingHTMLValues(waiting);

  let total = pledged + waiting;
  updateATotalStringWithValue('total-value', formatMoney(total));

  hideLoading(total);

}

async function getWaitingValueAsync() {
  try {
    let detailsRes = await axios.get('https://api.catarse.me/reward_details?project_id=eq.122021')
    let waiting = 0;

    detailsRes.data.forEach((d) => {
      let minimum = d.minimum_value;
      let wait = d.waiting_payment_count;

      waiting += minimum * wait;
    });

    return waiting;
  } catch (error) {
    console.error(error);
  }

}

async function getPledgedValueAsync() {
  try {
    let projectRes = await axios.get('https://api.catarse.me/project_details?project_id=eq.122021');

    return projectRes.data[0].pledged;

  } catch (error) {
    console.error(error);
  };
}

function updateAProgressBarWithValue(progress_bar, value) {
  document.getElementById(progress_bar).style.width = `${value}%`;
}

function updateATotalStringWithValue(string_id, value) {
  document.getElementById(string_id).innerHTML = `${value}`;
}

function updateWaitingHTMLValues(waiting) {
  let remaining = (waiting + pledged) >= META ? calcPercent(META - pledged) : calcPercent(waiting);

  updateAProgressBarWithValue('progressbar-wait', remaining);
  updateATotalStringWithValue('waiting', formatMoney(waiting));
}

function updatePledgedHTMLVaule(pledged) {
  updateAProgressBarWithValue('progressbar-conf', calcPercent(pledged));
  updateATotalStringWithValue('pledged', formatMoney(pledged));
}

function hideLoading(pledged){
  console.log(pledged);
  $('#loading').hide('slow');
}

function formatMoney(number = 0, prefix = true) {
  try {
    return prefix ?
      number.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      }).includes(',') ?
        number.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        }) :
        `${number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2, minimumFractionDigits: 2 })},00` :
      number.toLocaleString('pt-BR', {
        currency: 'BRL',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      }).includes(',') ?
        number.toLocaleString('pt-BR', {
          currency: 'BRL',
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        }) :
        `${number.toLocaleString('pt-BR', { currency: 'BRL', maximumFractionDigits: 2, minimumFractionDigits: 2 })},00`
  } catch {
    return `${'0'.toLocaleString('pt-BR', { currency: 'BRL', maximumFractionDigits: 2, minimumFractionDigits: 2 })},00`
  }
}

function calcPercent(number = 0) {
  return (number * 100) / 1200000;
}


// Detalhes do Projeto:
// https://api.catarse.me/project_details?project_id=eq.122021

// Detalhes de Recompensa:
// https://api.catarse.me/reward_details?project_id=eq.122021