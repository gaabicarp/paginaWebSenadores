//OBJETO VUE
var app = new Vue({
	el: "#main",
	data:{
		members: 0,
		statistics: {
			"membDem": 0,
			"membRep": 0,
			"membInd": 0,
			"withPrtyDem" : 0,
			"withPrtyRep" : 0,
			"withPrtyInd" : 0,
			"totalPer": 0
		},
		engaged: {
			"most": 0,
			"least": 0
		},
		loyalty: {
			"most":0,
			"least": 0
		}
	}
})


//FETCH
if (window.location.pathname.includes("senate")) {
    url = 'https://api.propublica.org/congress/v1/113/senate/members.json';
} else if (window.location.pathname.includes("house")) {
    url = 'https://api.propublica.org/congress/v1/113/house/members.json';
}

fetch(url ,{
	method: "GET",
	headers: new Headers({
		"X-API-Key" : 'w1kc2CRgHpJHxfGe8JKgXpMk3DOOiDuLO6KDV0oF'
	}),
}).then(response => response.json())
.then(data => {
	app.members = data.results["0"].members;
	compStat(app.members);
	getLoyalty(app.members);
	getEngaged(app.members);
});


//COMPLETA ESTADISTICAS
const compStat = (data) =>{
	app.statistics.membDem = count(app.members, 'D');
	app.statistics.membRep = count(app.members,'R');
	app.statistics.membInd = count(app.members,'I');
	app.statistics.withPrtyDem = withPrty(app.statistics.membDem);
	app.statistics.withPrtyRep = withPrty(app.statistics.membRep);
	app.statistics.withPrtyInd = withPrty(app.statistics.membInd);
	app.statistics.totalPer = totalPerc(app.statistics.withPrtyInd, app.statistics.withPrtyRep, app.statistics.withPrtyDem);
};


// FUNCION PARA LLENAR ESTADISTICA WHIT PARTY
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

//FUNCION PORCENTAJE FINAL
const totalPerc = (indep, rep, dem) =>{
	console.log(rep);
	if( indep == 0 || rep == 0 || dem ==0){
		return parseFloat(((rep + indep + dem)/2).toFixed(2));
	}
	else{
		return parseFloat(((rep + indep + dem)/3).toFixed(2));
	}
};


//FUNCION COMPLETAR LOYALTY
const getLoyalty = (data) =>{
	app.loyalty.most = funLoyalty(data, "most");
	app.loyalty.least = funLoyalty(data, "least");
};


//CALCULAR LOYALTY
const funLoyalty = (data, comp) =>{
	return data.sort(function(prev, next){
		if(comp=="most"){
			return prev.votes_with_party_pct - next.votes_with_party_pct;
		}
		else{
			return next.votes_with_party_pct - prev.votes_with_party_pct;
		}
	}).slice(0, data.length*0.1)
};




// FUNCION PARA LLENAR OBJETO ENGAGED
const getEngaged = (data) =>{
	app.engaged.most = funEngaged(data, "most"),
	app.engaged.least = funEngaged(data, "least")
};

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
};