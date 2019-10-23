// OBJETOS DE ESTADISTICA 
var statistics = new Vue({
 	el: '#app',
 	data: {
		members: [],
		stats: {
			membDem: 0,
			membRep: 0,
			membInd: 0,
			withPrtyDem : 0,
			withPrtyRep : 0,
			withPrtyInd : 0,
			totalPer: 0
		}
	}
});


var engaged = new Vue({
 	el: '#eng',
 	data: {
 		most: 0,
 		least: 0
	}
});


var loyalty = new Vue({
 	el: '#loy',
 	data: {
 		most: 0,
 		least: 0
	}
});
// LLAMADA AL API

fetch("https://api.propublica.org/congress/v1/113/house/members.json",{
    method: "GET",
    headers: new Headers({
        "X-API-Key" : 'w1kc2CRgHpJHxfGe8JKgXpMk3DOOiDuLO6KDV0oF'
    }),
}).then(response => response.json())
.then(data => {
	compStat(data);
	getEngaged(statistics.members);
	getLoyalty(statistics.members);
	// cargaGlance(app.statistics);
	// cargaTablas(app.engaged, app.loyalty);
});


const getLoyalty = (data) =>{
	loyalty.most = funLoyalty(data, "most");
	loyalty.least = funLoyalty(data, "least");
};

const funLoyalty = (data, comp) =>{
	return data.sort(function(prev, next){
		if(comp=="most"){
			return prev.votes_with_party_pct - next.votes_with_party_pct;
		}
		else{
			return next.votes_with_party_pct - prev.votes_with_party_pct;
		}
	}).slice(0, data.length*0.1)
}


// FUNCIONES PARA RELLENO DE STATISTICS
const compStat = (data) =>{
	statistics.members = data.results["0"].members;
	statistics.membDem = count(statistics.members, 'D');
	statistics.membRep = count(statistics.members,'R');
	statistics.membInd = count(statistics.members,'I');
	statistics.withPrtyDem = withPrty(statistics.membDem);
	statistics.withPrtyRep = withPrty(statistics.membRep);
	statistics.withPrtyInd = withPrty(statistics.membInd);
	statistics.totalPer = totalPerc(statistics.withPrtyInd, statistics.withPrtyRep, statistics.withPrtyDem);
}

// FUNCION PARA PORCENTAJE TOTAL

const totalPerc = (indep, rep, dem) =>{
	console.log(rep);
	if( indep == 0 || rep == 0 || dem ==0){
		return parseFloat(((rep + indep + dem)/2).toFixed(2));
	}
	else{
		return parseFloat(((rep + indep + dem)/3).toFixed(2));
	}
}

// FUNCION PARA LLENAR PORCENTAJE POR PARTIDO
const withPrty = (data) =>{
	var aux = 0;
	data.map(function(dato){
		aux += dato.votes_with_party_pct;
	})
	if(isNaN(aux/data.length)){
		return 0;
	}
	else{
	return parseFloat((aux/data.length).toFixed(2));
	}
}

// FUNCION PARA LLENAR NUMERO DE REPRESENTANTES
const count = (data, param) =>{
	return data.filter(function(dato){
		return dato.party == param;
	});
};

// FUNCION PARA LLENAR OBJETO ENGAGED
const getEngaged = (data) =>{
	engaged.most = funEngaged(data, "most"),
	engaged.least = funEngaged(data, "least")
}

// FUNCION PARA CALCULAR ENGAGED
const funEngaged = (data, comp) =>{
	return data.sort(function(prev, next){
		if(comp=="most"){
			return prev.missed_votes - next.missed_votes;
		}
		else{
			return next.missed_votes - prev.missed_votes;
		}
	}).slice(0, data.length*0.1)
}

//---------CARGA DE HTML ---------------------

// CARGA DE TABLA GLANCE
// const cargaGlance = (data) =>{
// 	var tablaGlance = document.getElementById("glance");
// 	if(data.membRep.length == 0){
// 		var htmlGlance = "<tr><td>Democrat</td><td>" + data.membDem.length + "</td><td>" + data.withPrtyDem + "</td></tr><tr><td>Independent</td><td>" + data.membInd.length + "</td><td>" + data.withPrtyInd + "</td></tr><tfoot><tr><td>TOTAL</td><td>" + data.members.length + "</td><td>" + data.totalPer + "</td></tr></tfoot>" ; 
// 	}
// 		else{
// 			if(data.membDem.length == 0){
// 			var htmlGlance = "<tr><td>Republican</td><td>" + data.membRep.length + "</td><td>" + data.withPrtyRep + "</td></tr><tr><td>Independent</td><td>" + data.membInd.length + "</td><td>" + data.withPrtyInd + "</td></tr><tfoot><tr><td>TOTAL</td><td>" + data.members.length + "</td><td>" + data.totalPer + "</td></tr></tfoot>";	
// 			}
// 			else{
// 				if(data.membInd.length == 0){
// 					var htmlGlance = "<tr><td>Republican</td><td>" + data.membRep.length + "</td><td>" + data.withPrtyRep + "</td></tr><tr><td>Democrat</td><td>" + data.membDem.length + "</td><td>" + data.withPrtyDem + "</td></tr><tfoot><tr><td>TOTAL</td><td>" + data.members.length + "</td><td>" + data.totalPer + "</td></tr></tfoot>";
// 				}
// 				else{
// 					var htmlGlance = "<tr><td>Republican</td><td>" + data.membRep.length + "</td><td>" + data.withPrtyRep + "</td></tr><tr><td>Democrat</td><td>" + data.membDem.length + "</td><td>" + data.withPrtyDem + "</td></tr><tr><td>Independent</td><td>" + data.membInd.length + "</td><td>" + data.withPrtyInd + "</td></tr><tfoot><tr><td>TOTAL</td><td>" + data.members.length + "</td><td>" + data.totalPer + "</td></tr></tfoot>";
// 				}
// 			}
// 		}
// 	tablaGlance.innerHTML = htmlGlance;
// }

// var cargaTablas = (data, data2) =>{
// 	if(document.getElementById("least") != null){
// 		console.log("entre")
// 		cargaEng(data.least, "least");
// 		cargaEng(data.most, "most");
// 	}
// 	else{
// 		console.log("noentre")
// 		cargaLoy(data2.least, "least-loy");
// 		cargaLoy(data2.most, "most-loy");
// 	}
// }

// const cargaEng = (data, key) =>{
// 	var tabla = document.getElementById(key);;
// 	var html = data.map(function(data){
// 		return "<tr><td>" + data.first_name + " " + data.last_name + "</td><td>" + data.missed_votes + "</td><td>" + data.missed_votes_pct + "</td></tr>";
// 	});
// 	tabla.innerHTML = html.join("");
// }


// const cargaLoy = (data, key) =>{
// 	var tabla = document.getElementById(key);;
// 	var html = data.map(function(data){
// 		var vot = (data.votes_with_party_pct * data.total_votes / 100).toFixed();
// 		return "<tr><td>" + data.first_name + " " + data.last_name + "</td><td>" + vot + "</td><td>" + data.votes_with_party_pct + "</td></tr>";
// 	});
// 	tabla.innerHTML = html.join("");
// }
