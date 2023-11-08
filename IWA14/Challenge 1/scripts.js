firstName = 'John';
age = 35;
pastTime = 'Coding';

const logTwice = () => {
  console.log((`Hello, ${firstName} (${age}). I love ${pastTime}!`))
  console.log((`Hello, ${firstName} (${age}). I love ${pastTime}!`))
}
function hobby () {
  logTwice()
}


hobby()