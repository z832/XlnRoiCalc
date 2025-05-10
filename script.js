// init vars
const rewardSchedule = [
  {
    blockStart: 34001,
    blockEnd: 621701,
    collateral: 300000,
    rewards: 12,
    rewardsPOS: 3,
    rewardsMN: 9,
  },
  {
    blockStart: 621702,
    blockEnd: 2724101,
    collateral: 1000000,
    rewards: 10,
    rewardsPOS: 2.5,
    rewardsMN: 7.5,
  },
  {
    blockStart: 2724102,
    blockEnd: 4826501,
    collateral: 1000000,
    rewards: 5,
    rewardsPOS: 1.25,
    rewardsMN: 3.75,
  },
  {
    blockStart: 4826502,
    blockEnd: 6928901,
    collateral: 1000000,
    rewards: 2,
    rewardsPOS: 0.5,
    rewardsMN: 1.5,
  },
  {
    blockStart: 6928901,
    blockEnd: Infinity,
    collateral: 1000000,
    rewards: 1,
    rewardsPOS: 0.25,
    rewardsMN: 0.75,
  },
]

const blocksPerDay = 1440

const explorerEndpoint = 'http://explorer.lunariumcoin.com/ext/getsummary'

let rewardIndex = 0
let bothMn = undefined


// init page elements
const rewardTable = document.querySelector('#reward-schedule table tbody')
const inputBlock = document.querySelector('#input-block')
const inputInvestment = document.querySelector('#input-investment')
const inputCurrentMn = document.querySelector('#input-current-mn')
const inputCurrentHashrate = document.querySelector('#input-current-hashrate')
const inputAdd = document.querySelector('#input-add')
const inputMnBothPlus = document.querySelector('#input-both-masternodes-plus')
const inputMnBothMinus = document.querySelector('#input-both-masternodes-minus')
const outputCollateral = document.querySelector('#output-collateral')
const outputRewardsMn = document.querySelector('#output-rewards-mn')
const outputRewardsPos = document.querySelector('#output-rewards-pos')
const inputForm = document.querySelector('#input-form')

const outputMnMasternodes = document.querySelector('#output-mn-masternodes')
const outputMnTotalMasternodes = document.querySelector('#output-mn-totalmasternodes')
const outputMnMasternodesRewardTime = document.querySelector('#output-mn-mnreward-time')
const outputMnMasternodesRewardDaily = document.querySelector('#output-mn-mnreward-daily')
const outputMnMasternodesRewardMonthly = document.querySelector('#output-mn-mnreward-monthly')
const outputMnMasternodesRewardYearly = document.querySelector('#output-mn-mnreward-yearly')
const outputMnTotalRewardDaily = document.querySelector('#output-mn-totalreward-daily')
const outputMnTotalRewardMonthly = document.querySelector('#output-mn-totalreward-monthly')
const outputMnTotalRewardYearly = document.querySelector('#output-mn-totalreward-yearly')
const outputMnRoiDaily = document.querySelector('#output-mn-roi-daily')
const outputMnRoiMonthly = document.querySelector('#output-mn-roi-monthly')
const outputMnRoiYearly = document.querySelector('#output-mn-roi-yearly')
const outputMnNetworkHashrate= document.querySelector('#output-mn-network-hashrate')

const outputPosTotalMasternodes = document.querySelector('#output-pos-totalmasternodes')
const outputPosStakingBalance = document.querySelector('#output-pos-staking-balance')
const outputPosWalletHashRate = document.querySelector('#output-pos-wallet-hashrate')
const outputPosNetworkHashRate = document.querySelector('#output-pos-network-hashrate')
const outputPosPosRewardTime = document.querySelector('#output-pos-posreward-time')
const outputPosPosRewardDaily = document.querySelector('#output-pos-posreward-daily')
const outputPosPosRewardMonthly = document.querySelector('#output-pos-posreward-monthly')
const outputPosPosRewardYearly = document.querySelector('#output-pos-posreward-yearly')
const outputPosTotalRewardDaily = document.querySelector('#output-pos-totalreward-daily')
const outputPosTotalRewardMonthly = document.querySelector('#output-pos-totalreward-monthly')
const outputPosTotalRewardYearly = document.querySelector('#output-pos-totalreward-yearly')
const outputPosRoiDaily = document.querySelector('#output-pos-roi-daily')
const outputPosRoiMonthly = document.querySelector('#output-pos-roi-monthly')
const outputPosRoiYearly = document.querySelector('#output-pos-roi-yearly')

const outputBothMasternodes = document.querySelector('#output-both-masternodes')
const outputBothTotalMasternodes = document.querySelector('#output-both-totalmasternodes')
const outputBothMasternodesRewardTime = document.querySelector('#output-both-mnreward-time')
const outputBothMasternodesRewardDaily = document.querySelector('#output-both-mnreward-daily')
const outputBothMasternodesRewardMonthly = document.querySelector('#output-both-mnreward-monthly')
const outputBothMasternodesRewardYearly = document.querySelector('#output-both-mnreward-yearly')
const outputBothStakingBalance = document.querySelector('#output-both-staking-balance')
const outputBothWalletHashRate = document.querySelector('#output-both-wallet-hashrate')
const outputBothNetworkHashRate = document.querySelector('#output-both-network-hashrate')
const outputBothPosRewardTime = document.querySelector('#output-both-posreward-time')
const outputBothPosRewardDaily = document.querySelector('#output-both-posreward-daily')
const outputBothPosRewardMonthly = document.querySelector('#output-both-posreward-monthly')
const outputBothPosRewardYearly = document.querySelector('#output-both-posreward-yearly')
const outputBothTotalRewardDaily = document.querySelector('#output-both-totalreward-daily')
const outputBothTotalRewardMonthly = document.querySelector('#output-both-totalreward-monthly')
const outputBothTotalRewardYearly = document.querySelector('#output-both-totalreward-yearly')
const outputBothRoiDaily = document.querySelector('#output-both-roi-daily')
const outputBothRoiMonthly = document.querySelector('#output-both-roi-monthly')
const outputBothRoiYearly = document.querySelector('#output-both-roi-yearly')

rewardSchedule.forEach((reward) => {
  const rewardRow = document.createElement('tr')
  rewardRow.innerHTML = `<td>${reward.blockStart}</td>` + 
                        `<td>${reward.blockEnd}</td>` + 
                        `<td>${reward.collateral}</td>` + 
                        `<td>${reward.rewards}</td>` +
                        `<td>${reward.rewardsMN}</td>` +
                        `<td>${reward.rewardsPOS}</td>`
  rewardTable.appendChild(rewardRow)
})

inputBlock.setAttribute('min', rewardSchedule[0].blockStart)


// functions
const formatXln = (number) => {
  return (number).toLocaleString(undefined, { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ' XLN'
}

const formatMinutes = (number) => {
  if (number === Infinity) {
    return '-'
  }
  return (number).toLocaleString(undefined, { 
    maximumFractionDigits: 2,
  }) + ' minutes'
}

const formatPercent = (number) => {
  const percentage = number * 100
  return (percentage).toLocaleString(undefined, { 
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }) + ' %'
}

const formatHashRate = (number) => {
  return (number).toLocaleString(undefined, { 
    maximumFractionDigits: 2,
  }) + ' GH/s'
}

const setReward = (blockNumber) => {
  const newRewardIndex = rewardSchedule.findIndex(row => row.blockStart <= blockNumber & row.blockEnd >= blockNumber)
  if (newRewardIndex === rewardIndex | newRewardIndex < 0) {
    return
  }
  // dependant vars update
  rewardIndex = newRewardIndex
  outputCollateral.textContent = formatXln(rewardSchedule[rewardIndex].collateral)
  outputRewardsMn.textContent = formatXln(rewardSchedule[rewardIndex].rewardsMN)
  outputRewardsPos.textContent = formatXln(rewardSchedule[rewardIndex].rewardsPOS)
  // ui - highlight relevant row
  const rewardRows = rewardTable.querySelectorAll('tr')
  rewardRows.forEach((row, index) => {
    index === newRewardIndex ? row.classList.add('highlighted') : row.classList.remove('highlighted')
  })
  //recalc output
  calculate()
}

const calculate = () => {
  // set calc vars
  const investment = Number(inputInvestment.value)
  const collateral = Number(rewardSchedule[rewardIndex].collateral)
  const rewardsMN = Number(rewardSchedule[rewardIndex].rewardsMN)
  const currentMn = Number(inputCurrentMn.value)
  const rewardsPOS = Number(rewardSchedule[rewardIndex].rewardsPOS)
  const currentHashrate = Number(inputCurrentHashrate.value)
  // calcs
  //    mn
  const mnMasternodes = Math.floor(investment / collateral)
  const mnNetworkMasternodes = inputAdd.checked ? mnMasternodes + currentMn : Math.max(currentMn, mnMasternodes)
  const mnMasternodeProportion = mnMasternodes / mnNetworkMasternodes
  const mnMasternodesRewardTime = 1 / mnMasternodeProportion
  const mnMasternodesRewardDaily = blocksPerDay * mnMasternodeProportion * rewardsMN
  const mnMasternodesRewardMonthly = mnMasternodesRewardDaily * 30.4375
  const mnMasternodesRewardYearly = mnMasternodesRewardDaily * 365.25
  const mnRoiDaily = mnMasternodesRewardDaily / investment
  const mnRoiMonthly = mnMasternodesRewardMonthly / investment
  const mnRoiYearly = mnMasternodesRewardYearly / investment
  //    pos
  const posStakingBalance = investment
  const posWalletHashRate = posStakingBalance / 15 / 1000
  const posNetworkHashRate = inputAdd.checked ? currentHashrate + posWalletHashRate : Math.max(currentHashrate, posWalletHashRate)
  const posHashRateProportion = posWalletHashRate / posNetworkHashRate
  const posPosRewardTime = 1 / posHashRateProportion
  const posPosRewardDaily = blocksPerDay * posHashRateProportion * rewardsPOS
  const posPosRewardMonthly = posPosRewardDaily * 30.4375
  const posPosRewardYearly = posPosRewardDaily * 365.25
  const posRoiDaily = posPosRewardDaily / investment
  const posRoiMonthly = posPosRewardMonthly / investment
  const posRoiYearly = posPosRewardYearly / investment
  //    both
  let bothMasternodes = bothMn === undefined ? mnMasternodes : bothMn
  if (bothMasternodes > mnMasternodes) {
    bothMasternodes = mnMasternodes
  }
  const bothNetworkMasternodes = inputAdd.checked ? bothMasternodes + currentMn : Math.max(currentMn, bothMasternodes)
  const bothMasternodeProportion = bothMasternodes / bothNetworkMasternodes
  const bothMasternodesRewardTime = 1 / bothMasternodeProportion
  const bothMasternodesRewardDaily = blocksPerDay * bothMasternodeProportion * rewardsMN
  const bothMasternodesRewardMonthly = bothMasternodesRewardDaily * 30.4375
  const bothMasternodesRewardYearly = bothMasternodesRewardDaily * 365.25
  const bothStakingBalance = investment - (bothMasternodes * collateral)
  const bothWalletHashRate = bothStakingBalance / 15 / 1000
  const bothNetworkHashRate = inputAdd.checked ? currentHashrate + bothWalletHashRate : Math.max(currentHashrate, bothWalletHashRate)
  const bothHashRateProportion = bothWalletHashRate / bothNetworkHashRate
  const bothPosRewardTime = 1 / bothHashRateProportion
  const bothPosRewardDaily = blocksPerDay * bothHashRateProportion * rewardsPOS
  const bothPosRewardMonthly = bothPosRewardDaily * 30.4375
  const bothPosRewardYearly = bothPosRewardDaily * 365.25
  const bothTotalRewardDaily = (bothMasternodesRewardDaily + bothPosRewardDaily)
  const bothTotalRewardMonthly = (bothMasternodesRewardMonthly + bothPosRewardMonthly)
  const bothTotalRewardYearly = (bothMasternodesRewardYearly + bothPosRewardYearly)
  const bothRoiDaily = bothTotalRewardDaily / investment
  const bothRoiMonthly = bothTotalRewardMonthly / investment
  const bothRoiYearly = bothTotalRewardYearly / investment
  // output
  //    mn
  outputMnNetworkHashrate.textContent = `${formatHashRate(currentHashrate)}`
  outputMnMasternodes.textContent = mnMasternodes
  outputMnTotalMasternodes.textContent = mnNetworkMasternodes
  outputMnMasternodesRewardTime.textContent = `${formatMinutes(mnMasternodesRewardTime)}`
  outputMnMasternodesRewardDaily.textContent = `${formatXln(mnMasternodesRewardDaily)}`
  outputMnMasternodesRewardMonthly.textContent = `${formatXln(mnMasternodesRewardMonthly)}`
  outputMnMasternodesRewardYearly.textContent = `${formatXln(mnMasternodesRewardYearly)}`
  outputMnTotalRewardDaily.textContent = `${formatXln(mnMasternodesRewardDaily)}`
  outputMnTotalRewardMonthly.textContent = `${formatXln(mnMasternodesRewardMonthly)}`
  outputMnTotalRewardYearly.textContent = `${formatXln(mnMasternodesRewardYearly)}`
  outputMnRoiDaily.textContent = `${formatPercent(mnRoiDaily)}`
  outputMnRoiMonthly.textContent = `${formatPercent(mnRoiMonthly)}`
  outputMnRoiYearly.textContent = `${formatPercent(mnRoiYearly)}`
  //    pos
  outputPosTotalMasternodes.textContent = currentMn
  outputPosStakingBalance.textContent = `${formatXln(posStakingBalance)}`
  outputPosWalletHashRate.textContent = `${formatHashRate(posWalletHashRate)}`
  outputPosNetworkHashRate.textContent = `${formatHashRate(posNetworkHashRate)}`
  outputPosPosRewardTime.textContent = `${formatMinutes(posPosRewardTime)}`
  outputPosPosRewardDaily.textContent = `${formatXln(posPosRewardDaily)}`
  outputPosPosRewardMonthly.textContent = `${formatXln(posPosRewardMonthly)}`
  outputPosPosRewardYearly.textContent = `${formatXln(posPosRewardYearly)}`
  outputPosTotalRewardDaily.textContent = `${formatXln(posPosRewardDaily)}`
  outputPosTotalRewardMonthly.textContent = `${formatXln(posPosRewardMonthly)}`
  outputPosTotalRewardYearly.textContent = `${formatXln(posPosRewardYearly)}`
  outputPosRoiDaily.textContent = `${formatPercent(posRoiDaily)}`
  outputPosRoiMonthly.textContent = `${formatPercent(posRoiMonthly)}`
  outputPosRoiYearly.textContent = `${formatPercent(posRoiYearly)}`
  //    both
  bothMasternodes === 0 ? inputMnBothMinus.setAttribute('disabled', 'true') : inputMnBothMinus.removeAttribute('disabled')
  bothMasternodes === mnMasternodes ? inputMnBothPlus.setAttribute('disabled', 'true') : inputMnBothPlus.removeAttribute('disabled')
  outputBothMasternodes.textContent = bothMasternodes
  outputBothTotalMasternodes.textContent = bothNetworkMasternodes
  outputBothMasternodesRewardTime.textContent = `${formatMinutes(bothMasternodesRewardTime)}`
  outputBothMasternodesRewardDaily.textContent = `${formatXln(bothMasternodesRewardDaily)}`
  outputBothMasternodesRewardMonthly.textContent = `${formatXln(bothMasternodesRewardMonthly)}`
  outputBothMasternodesRewardYearly.textContent = `${formatXln(bothMasternodesRewardYearly)}`
  outputBothStakingBalance.textContent = `${formatXln(bothStakingBalance)}`
  outputBothWalletHashRate.textContent = `${formatHashRate(bothWalletHashRate)}`
  outputBothNetworkHashRate.textContent = `${formatHashRate(bothNetworkHashRate)}`
  outputBothPosRewardTime.textContent = `${formatMinutes(bothPosRewardTime)}`
  outputBothPosRewardDaily.textContent = `${formatXln(bothPosRewardDaily)}`
  outputBothPosRewardMonthly.textContent = `${formatXln(bothPosRewardMonthly)}`
  outputBothPosRewardYearly.textContent = `${formatXln(bothPosRewardYearly)}`
  outputBothTotalRewardDaily.textContent = `${formatXln(bothTotalRewardDaily)}`
  outputBothTotalRewardMonthly.textContent = `${formatXln(bothTotalRewardMonthly)}`
  outputBothTotalRewardYearly.textContent = `${formatXln(bothTotalRewardYearly)}`
  outputBothRoiDaily.textContent = `${formatPercent(bothRoiDaily)}`
  outputBothRoiMonthly.textContent = `${formatPercent(bothRoiMonthly)}`
  outputBothRoiYearly.textContent = `${formatPercent(bothRoiYearly)}`
}


// set defaults
inputCurrentMn.value = 15
inputCurrentHashrate.value = 200
inputBlock.value = 750000
setReward(750000)
inputInvestment.value = 1000000
calculate()


// event handlers/listeners
const updateBlock = (e) => {
  const blockNumber = e.target.value
  setReward(blockNumber)
}

const updateBothMn = (amount) => {
  bothMn = Number(outputBothMasternodes.textContent) + amount
  calculate()
}

inputBlock.addEventListener('input', updateBlock)
inputInvestment.addEventListener('input', calculate)
inputCurrentMn.addEventListener('input', calculate)
inputCurrentHashrate.addEventListener('input', calculate)
inputAdd.addEventListener('change', calculate)
inputMnBothPlus.addEventListener('click', () => updateBothMn(1))
inputMnBothMinus.addEventListener('click', () => updateBothMn(-1))
inputForm.addEventListener('submit', function(event) {
  event.preventDefault()
})