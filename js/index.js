
var arrayLine = [];
var panier = [];
var panier_totalPrix = 0;
var coordonnees = [];

$(document).ready(function(){  
	$(".ecran2").hide();
	$(".ecran3").hide();
	chargerFile();	
	
	function chargerFile(){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				arrayLine = xhttp.responseText.split('\n');
			}
		};
		xhttp.open("GET", "file/articles.csv", true);
		xhttp.send();
	}
	
	$("#btnRecherche").click(function(){
		//console.log(arrayLine);
		var articleTrouve = false;
		var input, filter;
		var resultat = [];
		input = $('#txtRecherche').val(); //"CUI96831";
		filter = input.toUpperCase();
		for (i = 0; i < arrayLine.length; i++) {
			var line = arrayLine[i];
			if (line.toUpperCase().indexOf(filter) > -1) {
				resultat.push(line);
				articleTrouve = true;
			} else if(i== arrayLine.length-1 && articleTrouve){
				afficherResultat(resultat);
			}else if(i== arrayLine.length-1 && !articleTrouve){
				$('.resultatRecherche').html("Aucun article trouvé, veuillez effectuer une nouvelle recherche");
			}
		}		
    });
	
	function afficherResultat(result){
		var pageHtml = "<div class='text-left'><b>Resultat de la recherche </b</div><br/>";		
		pageHtml += '<table class="table table-striped table-bordered table.hover table-condensed"><thead><tr style="background:grey"><th>REF.</th><th>Nom de l\'article</th><th>Prix €, TTC</th><th>Panier</th></tr></thead><tbody>';
		
		for(var i=0; i<result.length; i++){
			var champ = result[i].split(';');
			pageHtml += '<tr><td>'+champ[0]+'</td><td>'+champ[1]+'</td><td>'+champ[3]+'</td><td><input type="button" value="ajouter" onclick=ajouterPanier("'+champ[0].replace(/ /g,"_")+'","'+champ[1].replace(/ /g,"_")+'",'+parseFloat(champ[3])+') class="btn" ></td></tr>';
		}		
		pageHtml += '</tbody></table>';
		$('.resultatRecherche').html(pageHtml);
	}
	
	
});

function afficherPanier(){
	if(panier.length != 0){
		var pageHtml = "<div class='text-left'><b>PANIER EN COURS </b</div><br/>";		
		pageHtml += '<table class="table table-striped table-bordered table.hover table-condensed"><thead><tr style="background:grey"><th>REF.</th><th>Nom de l\'article</th><th>Prix €, TTC</th><th>Quantité</th></tr></thead><tbody>';
		for(var j=0; j<panier.length; j++){
			var champ = panier[j];
			pageHtml += '<tr><td>'+champ.ref.replace(/_/g," ")+'</td><td class="champArticle">'+champ.article.replace(/_/g," ")+'</td><td>'+champ.prix+'</td>';
			pageHtml += '<td> <input type=button value="-" onclick=updatePanier("-","'+champ.ref+'")>'+parseInt(champ.quantite)+'<input type=button value="+" onclick=updatePanier("+","'+champ.ref+'")> <input type="button" value="supprimer" onclick=supprimerPanier("'+champ.ref+'") </td></tr>';
		}
		pageHtml += '</tbody></table>';
		
		panier_totalPrix = 0;
		for(var i=0; i<panier.length; i++){
			panier_totalPrix += (parseFloat(panier[i].prix) * parseFloat(panier[i].quantite));
		}
		
		pageHtml += '<div class="row"><div class="col-sm-6 text-center"><h2><b>TOTAL: '+parseFloat(panier_totalPrix)+' €</b></h2></div>';
		pageHtml += '<div class="col-sm-6"><h2><input type="button" value="Valider panier" onclick=validerPanier()></h2></div></div>';
		
		$('.resultatPanier').html(pageHtml);
	}else{
		$('.resultatPanier').html("<h4><b>VOTRE PANIER est vide !</b></h4>");
	}
}

function ajouterPanier(ref, article, prix){
	if(panier.length == 0){
		panier.push({"ref":ref, "article":article, "prix":prix, "quantite":1});
	}else{
		for(var i=0; i<panier.length; i++){
			if(panier[i].ref == ref){
				panier[i].quantite = parseInt(panier[i].quantite) + 1;
				i=panier.length+1;
			}
			else if(i==panier.length-1 && panier[i].ref != ref){
				panier.push({"ref":ref, "article":article, "prix":prix, "quantite":1});
				i=panier.length+1;
			}
		}
	}	
	afficherPanier();
}

function updatePanier(type, ref){
	if(type == "+"){
		for(var i=0; i<panier.length; i++){
			if(panier[i].ref == ref && parseInt(panier[i].quantite)<= 9){
				panier[i].quantite = parseInt(panier[i].quantite) + 1;
				i=panier.length+1;
			}
		}
	}
	else if(type == "-"){
		for(var i=0; i<panier.length; i++){
			if(panier[i].ref == ref && parseInt(panier[i].quantite)>= 2){
				panier[i].quantite = parseInt(panier[i].quantite) - 1;
				i=panier.length+1;
			}
		}
	}	
	afficherPanier();	
}

function supprimerPanier(ref){
	for(var i=0; i<panier.length; i++){
		if(panier[i].ref == ref){
			panier.splice(i, 1);
			i=panier.length+1;
		}
	}
	afficherPanier();	
}

function validerPanier(){
	$(".ecran1").hide();
	$(".ecran2").show();
	$(".ecran3").hide();	
}

function validerEcran2(){	
	initialiserError();
	var civilite = ($("#civilite").val()=="h")?"Mr":"Mme";
	var nom = $("#nom").val();
	var prenom = $("#prenom").val();
	var adresse = $("#adresse").val();
	var postalCode = $("#postalCode").val();
	var ville = $("#ville").val();
	var email = $("#email").val();	
	coordonnees.push({"civilite":civilite, "nom":nom, "prenom":prenom, "adresse":adresse, "postalCode":postalCode, "ville":ville, "email":email});
	
	if(civilite != ""  && nom != "" && prenom != "" && adresse != "" && postalCode != "" && ville != "" && email != "" && validateForm(email) && parseInt(postalCode) >0 && parseInt(postalCode) <99999){
		$(".ecran1").hide();
		$(".ecran2").hide();
		$(".ecran3").show();
		
		var pageHtml = civilite+" "+prenom+" "+nom+",<br/>"+adresse+","+postalCode+" "+ville;
		$(".adresseLivraison").html(pageHtml);
		
		var detailHtml = "";
		for(var j=0; j<panier.length; j++){
			var champ = panier[j];
			detailHtml += champ.quantite+"x "+champ.article.replace(/_/g," ")+", total "+(parseInt(champ.quantite)*parseFloat(champ.prix))+" euros<br/>";
		}
		$(".detailCommande").html(detailHtml);		
		$(".totalCommande").html("TOTAL de la commande = "+panier_totalPrix+" euros TTC");
	}
	if(parseInt(postalCode) <0 || parseInt(postalCode) >99999 || postalCode == "")
		$(".errorCode").html('<font style="color:red"><h6>Error: Code postale non valide </h6></font>');
	if(!validateForm(email))
		$(".errorMail").html('<font style="color:red"><h6>Error: email non valide </h6></font>');
	if(nom == "")
		$(".errorNom").html('<font style="color:red"><h6>Error: Nom obligatoire</h6></font>');
	if(prenom == "")
		$(".errorPrenom").html('<font style="color:red"><h6>Error: Prenom obligatoire</h6></font>');
	if(ville == "")
		$(".errorVille").html('<font style="color:red"><h6>Error: Ville obligatoire </h6></font>');
	if(adresse == "")
		$(".errorAdresse").html('<font style="color:red"><h6>Error: Adresse obligatoire </h6></font>');
	if(civilite != "Mr" && civilite != "Mme")
		$(".errorCivilite").html('<font style="color:red"><h6>Error: Civilité obligatoire</h6></font>');
}

function retourEcran1(){
	$(".ecran1").show();
	$(".ecran2").hide();
	$(".ecran3").hide();
}

function validateForm(mail) {
    var atpos = mail.indexOf("@");
    var dotpos = mail.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=mail.length)
        return false;
	return true;
}

function initialiserError(){
	$(".errorCode").html("");
	$(".errorCivilite").html("");
	$(".errorNom").html("");
	$(".errorPrenom").html("");
	$(".errorAdresse").html("");
	$(".errorVille").html("");
	$(".errorMail").html("");
}