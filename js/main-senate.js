fetch("https://api.propublica.org/congress/v1/113/senate/members.json",{
	method: "GET",
	headers: new Headers({
		"X-API-Key" : 'w1kc2CRgHpJHxfGe8JKgXpMk3DOOiDuLO6KDV0oF'
	}),
}).then(response => response.json())
.then(data => {
	var senadores = data.results["0"].members;
	var tabla = document.getElementById("senate-data")
	var html = senadores.map(function(senado){
		if(senadores.middle_name == null){
			return "<tr class=''><td><a href='" + senado.url + "' target='_blank'>" + senado.first_name + " " + senado.last_name + "</a></td><td>" +  senado.party + "</td><td>" + senado.state + "</td><td>" + senado.seniority + "</td><td>" + "%" + senado.votes_with_party_pct + "</td></tr>" 
		}
		else{
			return "<tr class=''><td><a href='" + senado.url + "' target='_blank'>" + senado.first_name + " " + senado.middle_name + " " + senado.last_name + "</a></td><td>" +  senado.party + "</td><td>" + senado.state + "</td><td>" + senado.seniority + "</td><td>" + "%" + senado.votes_with_party_pct + "</td></tr>"
		}
	});

	tabla.innerHTML = "<thead><tr><th>Nombre</th><th>Party</th><th>State</th><th>Seniority</th><th>Porcentaje</th>" + html.join("");
});