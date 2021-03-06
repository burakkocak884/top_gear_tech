



    $(function(){
        console.log('garages are loading!!!')
       listenForClick()
    });


   function listenForClick(){

             $('button#get-my-garages').on('click', function(event) {
                 event.preventDefault()

                let userId = event["currentTarget"]["dataset"]["id"]
                 getGarages(userId);

            })


           
            $(document).on('click', 'button#garage-data', function(event) {
                 event.preventDefault()
         
                let garageId = event["currentTarget"]["dataset"]["id"]
                 getGarage(garageId);

            })
           $(document).on('click', 'button#garageAppointments', function(event) {
                 event.preventDefault()
 
                let garageId = event["currentTarget"]["dataset"]["id"]

                 getAppointments(garageId);
            })

            //$(document).on('click', 'a.section', function(event) 
            $(document).on('click', 'button#appointmentDetail',function(event) {

                 event.preventDefault()
                 var appointmentId = event["currentTarget"]["dataset"]["id"]
                 let garageId = event["currentTarget"]["dataset"]["garage"]
                 let garagesUrl = event["currentTarget"]["baseURI"]

                 appointmentDetails(appointmentId, garageId,  garagesUrl)
            })

            $(document).on('click', 'button#create-garage', function(event) {
                 event.preventDefault()
        
                let userId = event["currentTarget"]["dataset"]["userid"]
                  createGarage(userId);

            })

           


            $('#new-garage-form').on('submit', function(event){
                  event.preventDefault()
                  let values = $(this).serialize()
                  $.post("/garages", values)
                  .done(function(data){

                    let newGarage = new Garage(data) 
                    let newGarageToAdd = newGarage.formatGarageHTML()
                    document.getElementById('garages-list').innerHTML = newGarageToAdd
              })
              
            })
  }

  function getGarages(userId){

        $.getJSON("/garages" , function(data)  {
         
        data.sort(function(a, b) {
        a = a.name;
        b = b.name;
        return a<b ? -1 : a>b ? 1 : 0;
        });
       
       
         console.log("the data is :", data);
         allGarages.length = data.length
        data.forEach(myFunction);
        function myFunction (grs){
          new Garage(grs);
        }
        
        
         const htmlGarages = allGarages.map(function (grj)  {
          return (grj.formatGarageHTML())
        })

        
         


         document.getElementById('garage-details').innerHTML = htmlGarages.join(" ")
          })
      }


    function getGarage(theId){

        $.getJSON("/garages/" + theId , function(data)  {
         
         console.log("the data is :", data);

         let myGarage = new Garage(data);
 
         let myGarHTML = myGarage.garageHTML()


         document.getElementById('garage-details').innerHTML = myGarHTML

        })
    }



const allGarages = []


    class Garage {
         constructor(grj){

         this.id = grj.id
         this.name = grj.name
         this.location = grj.location
         this.tire_service = grj.tire_service
         this.service_any_vehicle = grj.service_any_vehicle
         this.user_id = grj.user_id
         allGarages.push(this)
        }
        static newGarageForm() {
          
   return (`
     <form id=“new-garage-form”>
       <input id=‘name’ type=‘text’ name=‘garage[name]’ placeholder=“Garage Name”></input><br>
       <input id=‘location’ type=‘text’ name=‘garage[location]’ placeholder=“Location”></input><br>
       <input id=‘tire’ type="checkbox" name=‘garare[tire_service]’ ></input><br>
        <input id=‘service’ type="checkbox" name=‘garage[service_any_car]’></input><br>
       <input type ="submit"  />
     </form>
   `)
 };


    }
    function createGarage(userId){

 let form = `<form id=“new-garage-form”>
       <input id=‘name’ type=‘text’ name=‘garage[name]’ placeholder=“Garage Name”></input><br>
       <input id=‘location’ type=‘text’ name=‘garage[location]’ placeholder=“Location”></input><br>
       <span id ="dividertext">Tire Service</span><input id=‘tire’ type="checkbox" name=‘garare[tire_service]’ ></input><br>
       <span id ="dividertext">Service any Make/Model</span> <input id=‘service’ type="checkbox" name=‘garage[service_any_car]’></input><br>
       <input type ="submit" value ="Submit" />
     </form>`
document.getElementById('garage-form-display').innerHTML = form
     

}
//  Garage.prototype.garageFormHTML = function(){
//  return (`
//      <form id=“new-garage-form”>
//        <input id=‘name’ type=‘text’ name=‘garage[name]’ placeholder=“Garage Name”></input><br>
//        <input id=‘location’ type=‘text’ name=‘garage[location]’ placeholder=“Location”></input><br>
//        <input id=‘tire’ type=‘checkbox’ name=‘garare[tire_service]’ ></input><br>
//        <input id=‘service’ type=‘checkbox’ name=‘garage[service_any_car]’></input><br>
//        <input type =‘submit’/>
//      </form>
//    `)
// }


    Garage.prototype.garageHTML = function(){
      return (`
       <div>
      Name of the shop: <h2 style= "color: green">${this.name}</h2>
       Location: <h3><span id ="dividertext">${this.location}</span></h3>
       Offers tire service? <h3> <span id ="dividertext">${this.tire_service}</span></h3>
       Can repair and make and models? <h3><span id ="dividertext">${this.service_any_vehicle}</span></h3>
      </div>
      `)
    }

        Garage.prototype.formatGarageHTML = function(){
      return  ( `
        <h4>Name of the Shop: <span style="color: green">${this.name.toUpperCase()}</span></h4>
      <h3><button id = "garage-data" data-id = "${this.id}"><strong>Garage Details</strong><button id ="garageAppointments" data-id = "${this.id}"><strong>Appointments(sorted by date)</strong></button><div class ="garageDetail" id = "appointments-list-${this.id}"></div></h3>
<h1>---------------------------------------------------</h1>
    `)
    }



    




function getAppointments(theId){
    $.getJSON("/garages/" + theId + "/appointments", function(data)  {
      console.log("the data is.. :", data);
      data.sort(function(a, b) {
        a = new Date(a.date);
        b = new Date(b.date);
        return a>b ? -1 : a<b ? 1 : 0;
        });
        data.forEach(myFunction);
        allAppointments.length = data.length
        function myFunction (appt){
          new Appointment(appt);
        }
        

         
        const htmlAppts = allAppointments.map(function (appt)  {
          return (appt.appointmentHTML())
    })
    

    document.getElementById(`appointments-list-${theId}`).innerHTML = htmlAppts.join(" ")
    })
}

const allAppointments  = []


class Appointment {
 constructor(appt){

 this.id = appt.id
 this.date = appt.date
 this.description = appt.description
 this.garage_id = appt.garage_id
 this.customer_id = appt.customer_id

 allAppointments.push(this)

 
}
}

Appointment.prototype.appointmentHTML = function(){


return (`
 
 <button class ="garageDetail" id = "appointmentDetail"  data-id ="${this.id}" data-garage ="${this.garage_id}"> ${this.date.split("T")[0] + " at " + this.date.split("T")[1].split(".")[0]} </button> <div id ="appointment-details-${this.id}"></div>
 
 


`)
}
 function appointmentDetails(appointmentId, garageId,  garagesUrl) {

 $.getJSON( garagesUrl + "/" + garageId + "/appointments/" + appointmentId, function(data)  {


  let myAppt = new Appointment(data)
 myAppt.firstName = data.customer.first_name
 myAppt.lastName = data.customer.last_name
 myAppt.email = data.customer.email
 myAppt.balance = data.customer.standing_balance
 myAppt.vehicleYear = data.vehicle.year
 myAppt.vehicleMake= data.vehicle.make
 myAppt.vehicleModel = data.vehicle.model
 myAppt.vehicletag = data.vehicle.license_plate
 myAppt.vehicleMileage= data.vehicle.mileage
 myAppt.vehicleColor = data.vehicle.color





 let theAppt = myAppt.theAppointmentHTML()


  document.getElementById(`appointment-details-${appointmentId}`).innerHTML = theAppt




 })
}
Appointment.prototype.theAppointmentHTML = function (){
  
return (`
  
 <h5>Description: <span id ="textinfo"> ${this.description}</span></h5>
  <h4 id ="dividertext"> << Customer Info >> </h4>
  <h5> Name:  <span id ="textinfo">${this.firstName} ${this.lastName}</span> Email: <span id ="textinfo">${this.email}</span> Standing balance : <span id ="textinfo">$ ${this.balance}</span></h5>

  <h4 id ="dividertext"> << Vehicle Info >> </h4>
  <h5>Year: <span id ="textinfo">${this.vehicleYear}</span> Make: <span id ="textinfo">${this.vehicleMake}</span> Model: <span id ="textinfo">${this.vehicleModel}</span> License Plate: <span id ="textinfo">${this.vehicletag}</span> Current Mileage: <span id ="textinfo">${this.vehicleMileage}</span> Exterior Color: <span id ="textinfo">${this.vehicleColor}</span></h5>
  
  `)
}
 






