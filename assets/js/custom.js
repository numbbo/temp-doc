/* Url to the plots */
plotPath = "https://raw.githubusercontent.com/numbbo/bbob-biobj-plots/gh-pages/plots_currData_Sep2020/"

/* Define some global variables */
var typs = ["Pareto set approximation", "Pareto set approximation (optima direction)", "Pareto front approximation (original space)", "Pareto front approximation (normalized space)", "Dominance ratio", "Level sets", "Local dominance", "Gradient length", "Path length"];
var valuesTyp = ["directions-searchspace", "directions-searchspace-projection", "directions-objspace", "directions-logobjspace", "dominance-ratio", "level-sets", "local-dominance", "gradient-length", "path-length"];
var allNodes = ["dimAll", "funAll", "insAll", "typAll"];
var selectedNode = "typAll";
var valuesDim = ["2", "3", "5"];
var valuesFun = [];
for (let i = 1; i <= 92; i++) {valuesFun.push(i);}
var valuesIns = [];
for (let i = 1; i <= 15; i++) {valuesIns.push(i);}
var valuesCol = [];
for (let i = 1; i <= 10; i++) {valuesCol.push(i);}

/* Fill the table with values */
window.onload=function() {

    /* Fill the columns dropdown with values */
    var selectCol = document.getElementById("col");
    var contentsCol;
    for (let i = 0; i < valuesCol.length; i++) {
        contentsCol += "<option>" + valuesCol[i] + "</option>";
    }
    selectCol.innerHTML = contentsCol;
    selectCol.selectedIndex = 4;

    /* Fill the dimensions dropdown with values */
    var selectDim = document.getElementById("dim");
    var contentsDim;
    for (let i = 0; i < valuesDim.length; i++) {
        contentsDim += "<option>" + valuesDim[i] + "</option>";
    }
    selectDim.innerHTML = contentsDim;

    /* Fill the functions dropdown with values */
    var selectFun = document.getElementById("fun");
    var contentsFun;
    for (let i = 0; i < valuesFun.length; i++) {
        contentsFun += "<option>" + valuesFun[i] + "</option>";
    }
    selectFun.innerHTML = contentsFun;

    /* Fill the instances dropdown with values */
    var selectIns = document.getElementById("ins");
    var contentsIns;
    for (let i = 0; i < valuesIns.length; i++) {
        contentsIns += "<option>" + valuesIns[i] + "</option>";
    }
    selectIns.innerHTML = contentsIns;

    /* Fill the plot types dropdown with values */
    var selectTyp = document.getElementById("typ");
    /* Make sure typs and valuesTyp have the same length! */
    var contentsTyp;
    for (let i = 0; i < typs.length; i++) {
        contentsTyp += "<option value=\"" + valuesTyp[i] + "\">" + typs[i] + "</option>";
    }
    selectTyp.innerHTML = contentsTyp;

    /* By default, plot types are chosen */
    selectNode(document.getElementById(selectedNode));
}

/* Display number with leading zero */
function pad(num) {
	let size = 2;
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

/* Adds the plot to the div */
function addPlot(plotName) {
	let plotWidth = 100 / col.value;
	var elemDiv = document.createElement('div');
	var elemA = document.createElement('a');
	var elemImg = document.createElement("img");
	elemDiv.setAttribute("style", "display:inline-block; width:" + plotWidth + "%;");
	elemA.setAttribute("href", plotPath + plotName);
	elemA.setAttribute("class", "nostyle");
	elemImg.setAttribute("src", plotPath + plotName);
	elemImg.setAttribute("alt", "");
	elemA.appendChild(elemImg);
	elemDiv.appendChild(elemA);
	document.getElementById("images").appendChild(elemDiv);
	document.getElementById("result").value = elemDiv.getAttribute("style") + "\n";
}

/* Show the plots wrt the chosen dimension, function, instance and plot type.
Exactly one of these categories contains all possible values, the rest only the
chosen one. */
function changePlot() {
	let plotName;
	let chosenDim = [dim.value];
	let chosenFun = [fun.value];
	let chosenIns = [ins.value];
	let chosenTyp = [typ.value];
	let textName;
	if (selectedNode === "dimAll") {
		chosenDim = [...valuesDim];
	} else if (selectedNode === "funAll") {
		chosenFun = [...valuesFun];
	} else if (selectedNode === "insAll") {
		chosenIns = [...valuesIns];
	} else if (selectedNode === "typAll") {
		chosenTyp = [...valuesTyp];
	}
	document.getElementById("images").innerHTML = "";
	// document.getElementById("result").value = "";
	for (let iDim = 0; iDim < chosenDim.length; iDim++) {
		for (let iFun = 0; iFun < chosenFun.length; iFun++) {
			for (let iIns = 0; iIns < chosenIns.length; iIns++) {
				for (let iTyp = 0; iTyp < chosenTyp.length; iTyp++) {
					plotName = "biobj_f" + pad(chosenFun[iFun]) + "_i" + pad(chosenIns[iIns]) + "_d" + pad(chosenDim[iDim]) + "_" + pad(chosenTyp[iTyp]) + ".png";
					addPlot(plotName);
					// document.getElementById("result").value += plotName + "\n";
				}
			}
		}
	}

	/* Make sure only the correct plot descriptions are shown */
	for (let iTyp = 0; iTyp < valuesTyp.length; iTyp++) {
		textName = "text-" + valuesTyp[iTyp];
		if (selectedNode === "typAll") {
			document.getElementById(textName).setAttribute("style", "display:block;");
		}
		else if (valuesTyp[iTyp] === chosenTyp[0]) {
			document.getElementById(textName).setAttribute("style", "display:block;");
		}
		else {
			document.getElementById(textName).setAttribute("style", "display:none;");
		}
	}
	if ((selectedNode === "typAll") ||
	(chosenTyp[0] === "directions-objspace") ||
	(chosenTyp[0] === "directions-logobjspace") ||
	(chosenTyp[0] === "directions-searchspace") ||
	(chosenTyp[0] === "directions-searchspace-projection")) {
		document.getElementById("text-additional-info").setAttribute("style", "display:block;");
	} else {
		document.getElementById("text-additional-info").setAttribute("style", "display:none;");
	}

	/* Make sure only the correct function description is shown */
	if (selectedNode === "funAll") {
		document.getElementById("text-function").setAttribute("style", "display:none;");
	}
	else {
		document.getElementById("text-function").setAttribute("style", "display:block;");
	}
	for (let iFun = 0; iFun < valuesFun.length; iFun++) {
		textName = "text-f" + valuesFun[iFun];
		if (valuesFun[iFun] == chosenFun[0]) {
			document.getElementById(textName).setAttribute("style", "display:block;");
		}
		else {
			document.getElementById(textName).setAttribute("style", "display:none;");
		}
	}
}

/* Move the dropdown selection to the previous item in the list */
function getPrev(ele) {
	let select = document.getElementById(ele.id.substring(0, 3));
	let len = select.length;
	let curr_index = select.selectedIndex;
	if (curr_index > 0) {
		select.selectedIndex--;
	} else {
		select.selectedIndex = len-1;
	}
	changePlot();
}

/* Move the dropdown selection to the next item in the list */
function getNext(ele) {
	let select = document.getElementById(ele.id.substring(0, 3));
	let len = select.length;
	let curr_index = select.selectedIndex;
	if (curr_index < len - 1) {
		select.selectedIndex++;
	} else {
		select.selectedIndex = 0;
	}
	changePlot();
}

/* Disable (or enable) the element */
function disableElements(ele, mode) {
	document.getElementById(ele + "Prev").disabled = mode;
	document.getElementById(ele).disabled = mode;
	document.getElementById(ele + "Next").disabled = mode;
	if (mode == false) {
		document.getElementById(ele + "Prev").style.cursor = "pointer";
		document.getElementById(ele).style.cursor = "pointer"
		document.getElementById(ele + "Next").style.cursor = "pointer"
	} else {
		document.getElementById(ele + "Prev").style.cursor = "default";
		document.getElementById(ele).style.cursor = "default"
		document.getElementById(ele + "Next").style.cursor = "default"
	}
}

/* Select the table cell */
function selectNode(node) {
  	selectedNode = node.id;
	for (let i = 0; i < allNodes.length; i++) {
		if (selectedNode === allNodes[i]) {
			document.getElementById(allNodes[i]).className = "on";
		  disableElements(allNodes[i].substring(0, 3), true);
		} else {
			document.getElementById(allNodes[i]).className = "off";
		  disableElements(allNodes[i].substring(0, 3), false);
		}
	}
	changePlot()
}
