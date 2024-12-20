// function example1(message) {
//     const modelessDialog = document.getElementById("modeless-dialog");
//     document.getElementById("modeless-message").textContent = message;
//     modelessDialog.show();
//   }
  
  function closeModelessDialog() {
    document.getElementById("modeless-dialog").close();
  }
  
//   function example2(message) {
//     const modalDialog = document.getElementById("modal-dialog");
//     document.getElementById("modal-message").textContent = message;
//     modalDialog.showModal();
//   }
  
  function handleYes() {
    document.getElementById("modal-dialog").close();
    console.log(JSON.stringify({ response: "yes" }));
  }
  
  function handleNo() {
    document.getElementById("modal-dialog").close();
    console.log(JSON.stringify({ response: "no" }));
  }
  
   function example3() {
     const lunchDialog = document.getElementById("lunch-dialog");
     lunchDialog.showModal();
   }
  
  function submitLunchOrder() {
    const result = {
      main: document.getElementById("main-item").value,
      side: document.getElementById("side-item").value,
      drink: document.getElementById("drink-item").value,
      name: document.getElementById("name").value,
      toGo: document.getElementById("to-go").checked,
    };
    document.getElementById("lunch-dialog").close();
    console.log(JSON.stringify(result));
  }
  