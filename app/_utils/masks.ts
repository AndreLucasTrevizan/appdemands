export const phoneMasked = (phone: string) => {
  if (phone.length < 10) {
    return "Quantidade de caracteres invalido, no mínimo 10 caracteres";
  }

  if (phone.length > 10) {
    return "Quantidade de caracteres invalido, o máximo é 10";
  }

  let dd = phone.slice(0, 2);
  let theFirstPart = phone.slice(2, 6);
  let theSecondPart = phone.slice(6, 10);

  return `(${dd}) ${theFirstPart}-${theSecondPart}`;
}

export const whatsMasked = (phone: string) => {
  if (phone.length < 11) {
    return "Quantidade de caracteres invalido, no mínimo 11 caracteres";
  }
  
  if (phone.length > 11) {
    return "Quantidade de caracteres invalido, o máximo é 11";
  }

  let dd = phone.slice(0, 2);
  let theFirstPart = phone.slice(2, 7);
  let theSecondPart = phone.slice(7, 11);

  return `(${dd}) ${theFirstPart}-${theSecondPart}`;
}
