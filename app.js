const ui = ( function() {    

    let domStrings = {  //  all elements reference 
            inputType:document.querySelector(".add_type"),
            inputDescription: document.querySelector("input[type=text]"),
            inputValue: document.querySelector("input[type=number]"),
            submitButton: document.querySelector(".add_btn"),
            incomeList: document.querySelector(".income"),
            expenseList: document.querySelector(".expense"),
            totalInc:document.querySelector("#total-income-value"),
            totalExp: document.querySelector("#total-expenses-value"),
            totalBudget: document.querySelector("#available-budget")
    }

    let domInputs = {  // storing all 3 inputs values in an object for easy referencing + an id for each specific item
        type: document.querySelector(".add_type").value,
        description: document.querySelector("input[type=text]").value,
        value: document.querySelector("input[type=number]").value,
        id: 0
    }

    let clearFields = function(){   // empty input fields after submission -> retrieve list -> transform to array -> clear inputs value
        let fields = document.querySelectorAll( "input[type=text]" + "," + "input[type=number]" );
        let arr = Array.prototype.slice.call(fields);
        arr.forEach(element => {       
              element.value = "" ;
        });
    }

    let addUiItem = function(type, description , value , id){    // creating a list item  ; will receive the inputs values and an id
        let newElement = `<div class="${type}-list" id="${id}"><div class="input-description">${description}</div><div class="input-value">${value}</div><div class="delete-button-container"><button class="delete-item"><i class="ion-ios-close-outline delete-item"></i></button></div></div>`;        
        return newElement
}



    return {  // will update the month&year directly 
        crtMonth: document.querySelector("#month").innerHTML = new Intl.DateTimeFormat('en-GB', {month: 'long'}).format(new Date()) ,
        crtYear: document.querySelector("#year").innerHTML = new Intl.DateTimeFormat('en-GB', {year: 'numeric'}).format(new Date()) ,
        domInputs: domInputs,
        domStrings: domStrings,
        addUiItem: addUiItem,
        clearFields: clearFields
    }
})()

// budget
const budgetController = ( function(){

    var Income = function(id , description , value ) {   // functions constructors creating an object for one item in list 
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Expense = function(id , description , value ) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let data = {   // an object holding the items in each list
        list: {
            income:[],
            expense:[]
        },
        totals: function( incomeSection , expenseSection, totalSection) {   // updating the ui budget section based on data stored
            let inc = this.list.income.reduce( (acc,x)=> acc += x.value , 0 )   // sum based on the income array in the list object
            let exp =  this.list.expense.reduce( (acc,x)=> acc += x.value , 0 ) // sum of other list
            let tot = inc - exp
            incomeSection.innerHTML = inc;  //  dom update
            expenseSection.innerHTML = 0 - exp
            totalSection.innerHTML = tot;
            return {
            totalInc: incomeSection,
            totalExp: expenseSection,
            totalBudget: totalSection
             }
        }
    }

    return {
        data: data,
        addToList: function(type , description , value ,id ){ // adding a new item in the list object using the coonstructors
            if(type === "income" ){    // based on type
                newItem = new Income(id,description,parseInt(value))
                data.list[type].push(newItem);
            }
            else if(type === "expense"){
                newItem = new Expense(id,description,parseInt(value))
                data.list[type].push(newItem);
            }
            return data
        },
        removeFromList: function(type , elId){   // removing item from list 
                //let getAllIds = data.list.income.map(elem => elem.id).concat( data.list.expense.map( elem => elem.id) )
            let regexIncome = /income/i;
            let regexExpense = /expense/i;
            if( regexIncome.test( type  ) )  data.list.income = data.list.income.filter( x => x.id !== elId )  // the type will be checked using the element's class   
             else if( regexExpense.test( type  ))   data.list.expense = data.list.expense.filter( x => x.id !== elId )
           }
       }
})()

//  the application controller 
const appControler = ( function(ui , budgetController) {  // uses information from both ui and budget to update the data and the ui

    let setupEvListners = function(strings , inputs){ // setting up all events ; receive the ui objects holding all inputs and all strings
    
    strings.inputType.addEventListener("change" ,        (ev) => inputs.type = ev.target.value)      //retaining inputs values
    strings.inputDescription.addEventListener("change" , (ev) => inputs.description = ev.target.value )  //retaining inputs values
    strings.inputValue.addEventListener("change" ,       (ev) => inputs.value = ev.target.value)  //retaining inputs values
    strings.submitButton.addEventListener( "click" , (ev) => {  //  submit to update lists in ui
        ev.preventDefault();  
        if( inputs.description !== "" && inputs.value !== ""  && inputs.value > 0 ) {  // some input restrictions
            
            if( inputs.type === "income" ) { //adding new element to list based on the type of input
                    strings.incomeList.innerHTML += ui.addUiItem( inputs.type, inputs.description , inputs.value , inputs.id) ;  // add item in list in dom    
                    ui.clearFields();  // clear inputs 
                    budgetController.addToList( inputs.type , inputs.description, inputs.value, inputs.id );  // updating list with new object in the budget controller
                    inputs.id++; // updating next element id
            }
            else if (  inputs.type === "expense" ) {
                    strings.expenseList.innerHTML += ui.addUiItem(inputs.type, inputs.description , inputs.value , inputs.id) ;
                    ui.clearFields(); 
                    budgetController.addToList(inputs.type, inputs.description , inputs.value , inputs.id);
                     inputs.id++;
            }
        }  else if( inputs.description == "")    { 
                    alert("Please add an income description!")
                }
        else {
            alert("Please add a numeric value!")
        }

            budgetController.data.totals(strings.totalInc , strings.totalExp , strings.totalBudget  )   //update budget section
    })

    strings.incomeList.addEventListener("click", function(ev){   // removing item list
            if(ev.target  && ev.target.matches(".delete-item") ) {    
             budgetController.removeFromList( ev.target.offsetParent.classList.value , parseInt(ev.target.offsetParent.id) )
             ev.target.offsetParent.remove(); // removing dom element
            budgetController.data.totals(strings.totalInc , strings.totalExp , strings.totalBudget  ) //recalculating the budget after removing items
            }
    } )

    strings.expenseList.addEventListener("click", function(ev){   // removing item list
            if(ev.target  && ev.target.matches(".delete-item") ) {  
            budgetController.removeFromList( ev.target.offsetParent.classList.value , parseInt(ev.target.offsetParent.id) )
          ev.target.offsetParent.remove();
        budgetController.data.totals(strings.totalInc , strings.totalExp , strings.totalBudget  )
        }
    } )

}

return {
        innit: function() { setupEvListners(ui.domStrings , ui.domInputs);  }
    }

})(ui , budgetController)


appControler.innit();

