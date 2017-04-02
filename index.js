
var arrayLine = [];
var panier = [];

$(document).ready(function(){    
	chargerFile();	
	function chargerFile(){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				arrayLine = xhttp.responseText.split('\n');
			}
		};
		xhttp.open("GET", "articles.csv", true);
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
				parseResultat(resultat);
			}else if(i== arrayLine.length-1 && !articleTrouve){
				$('.resultatRecherche').html("Aucun article trouvé, veuillez effectuer une nouvelle recherche");
			}
		}		
    });
	
	function parseResultat(result){
		var pageHtml = "<b>Resultat de la recherche </b<br/>";		
		pageHtml += '<table class="table table-striped table-bordered table.hover table-condensed"><thead><tr style="background:grey"><th>REF.</th><th>Nom de l\'article</th><th>Prix €, TTC</th><th>Panier</th></tr></thead><tbody>';
		
		for(var i=0; i<result.length; i++){
			var champ = result[i].split(';');
			pageHtml += '<tr><td>'+champ[0]+'</td><td>'+champ[1]+'</td><td>'+champ[3]+'</td><td><input type="button" value="ajouter" onclick=ajouterPanier("'+champ[0].replace(/ /g,"_")+'","'+champ[1].replace(/ /g,"_")+'",'+parseFloat(champ[3])+') class="btn" ></td></tr>';
		}		
		pageHtml += '</tbody></table>';
		$('.resultatRecherche').html(pageHtml);
	}
	
	
});

function ajouterPanier(ref, article, prix){
	if(panier.length == 0)
		panier.push({"ref":ref, "article":article, "prix":prix, "quantite":1});
	else{
		for(var i=0; i<panier.length; i++){
			if(panier[i].ref == ref){
				//console.log("in");
				panier[i].quantite = parseInt(panier[i].quantite) + 1;
			}
			else if(i==panier.length-1 && panier[i].ref != ref)
				panier.push({"ref":ref, "article":article, "prix":prix, "quantite":1});
		}
	}
	//panier.push({"ref":ref, "article":article, "prix":prix, "quantite":1});
	
	if(panier.length != 0){
		var pageHtml = "<b>PANIER EN COURS </b<br/>";		
		pageHtml += '<table class="table table-striped table-bordered table.hover table-condensed"><thead><tr style="background:grey"><th>REF.</th><th>Nom de l\'article</th><th>Prix €, TTC</th><th>Quantité</th></tr></thead><tbody>';
		for(var j=0; j<panier.length; j++){
			var champ = panier[j];
			pageHtml += '<tr><td>'+champ.ref.replace(/_/g," ")+'</td><td>'+champ.article.replace(/_/g," ")+'</td><td>'+champ.prix+'</td><td>'+parseInt(champ.quantite)+'</td></tr>';
		}
		pageHtml += '</tbody></table>';
		$('.resultatPanier').html(pageHtml);
	}
		//alert('nono');
	}