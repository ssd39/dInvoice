export const symbolMap = {
  "$": "USD",
  "£": "GBP",
  "¥": "JPY",
  "₿": "BTC",
  "♦": "ETH",
};

export default async (baseCurrency, cryptoSymbol) => {
  try {
    const r = await fetch(
      `${process.env.REACT_APP_PFI_API}/getPrice?baseCurrency=${baseCurrency}&cryptoSymbol=${cryptoSymbol}`
    );
    return parseFloat((await r.json()).price);
  } catch (e) {
    console.error(e);
    return 0;
  }
};
