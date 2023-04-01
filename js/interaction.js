(function () {
  "use strick";
  // armazenar o DOM em variaveis
  const inputForm = document.querySelector("#inputForm");
  const todoFormAdd = document.querySelector("#todoForm");
  const ul = document.querySelector("ul");
  const lis = ul.getElementsByTagName("li");

  let arrTasks = getSavedData();

  function getSavedData() {
    let TasksData = localStorage.getItem("tasks");
    TasksData = JSON.parse(TasksData);

    return TasksData
      ? TasksData
      : [
          {
            name: "Exemplo 1",
            createdAt: Date.now(),
            completed: false,
          },
        ];
  }
  function setNewData() {
    localStorage.setItem("tasks", JSON.stringify(arrTasks));
  }
  setNewData();
  function generateLiTask(obj) {
    const li = document.createElement("li");
    const p = document.createElement("p");
    const iCheck = document.createElement("i");
    const iEdit = document.createElement("i");
    const iDelete = document.createElement("i");
    iCheck.setAttribute("data-action", "checkButton");
    iCheck.className = "checado fa-regular fa-circle-check";
    iEdit.setAttribute("data-action", "editButton");
    iEdit.className = "edit fa-solid fa-pen-to-square";
    iDelete.setAttribute("data-action", "deleteButton");
    iDelete.className = "delete fa-solid fa-trash-can";

    li.appendChild(iCheck);
    p.textContent = obj.name;
    li.appendChild(p);
    li.appendChild(iEdit);
    li.appendChild(iDelete);

    const divContainerEdit = document.createElement("div");
    divContainerEdit.className = "containerEdit";
    const inputEdit = document.createElement("input");
    inputEdit.setAttribute("type", "text");
    inputEdit.className = "inputEdit";
    inputEdit.value = obj.name;
    divContainerEdit.appendChild(inputEdit);
    const editContainer = document.createElement("i");
    editContainer.setAttribute("data-action", "editCButton");
    editContainer.className = "fa-solid fa-file-export";
    divContainerEdit.appendChild(editContainer);
    const cancelContainer = document.createElement("i");
    cancelContainer.setAttribute("data-action", "CancelCButton");
    cancelContainer.className = "fa-solid fa-ban";
    divContainerEdit.appendChild(cancelContainer);

    li.appendChild(divContainerEdit);

    return li;
  }

  function renderTask() {
    ul.innerHTML = "";
    arrTasks.forEach((task) => {
      ul.appendChild(generateLiTask(task));
    });
  }

  function addTask(task) {
    arrTasks.push({
      name: task,
      createdAt: Date.now(),
      completed: true,
    });
    setNewData();
  }

  function clickedUL(e) {
    const dataAction = e.target.getAttribute("data-action");
    if (!dataAction) {
      return;
    }
    let currentLi = e.target;
    while (currentLi.nodeName !== "LI") {
      currentLi = currentLi.parentElement;
    }

    const currentLiIndex = [...lis].indexOf(currentLi);
    const actions = {
      checkButton: function () {
        arrTasks[currentLiIndex].completed =
          !arrTasks[currentLiIndex].completed;

        if (arrTasks[currentLiIndex].completed) {
          currentLi
            .querySelector(".fa-regular")
            .classList.remove("fa-circle-check");
          currentLi.querySelector(".fa-regular").classList.add("fa-circle");
        } else {
          currentLi.querySelector(".fa-regular").classList.remove("fa-circle");
          currentLi
            .querySelector(".fa-regular")
            .classList.add("fa-circle-check");
        }
        setNewData();
      },
      editButton: function () {
        const containerEdit = currentLi.querySelector(".containerEdit");
        [...ul.querySelectorAll(".containerEdit")].forEach((container) => {
          container.removeAttribute("style");
        });
        containerEdit.style.display = "grid";
      },
      deleteButton: function () {
        arrTasks.splice(currentLiIndex, 1);
        renderTask();
        setNewData();
      },
      editCButton: function () {
        const val = currentLi.querySelector(".inputEdit").value;
        arrTasks[currentLiIndex].name = val;
        renderTask();
        setNewData();
      },
      CancelCButton: function () {
        currentLi.querySelector(".containerEdit").removeAttribute("style");
        currentLi.querySelector(".inputEdit").value =
          arrTasks[currentLiIndex].name;
      },
    };
    if (actions[dataAction]) {
      actions[dataAction]();
    }
  }

  todoFormAdd.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log(inputForm.value);
    addTask(inputForm.value);
    renderTask();

    inputForm.value = "";
    inputForm.focus();
  });

  ul.addEventListener("click", clickedUL);

  renderTask();
})();
