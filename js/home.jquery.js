var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Store session
function setPage(pageValue) {
	var sections = (pageValue).split("/");
	var currentAddr = sections[sections.length - 1];
	sessionStorage.setItem("currentPage", currentAddr);
	window.location.href = "/#" + pageValue;
}

// Store session
function setPageSection(pageValue) {
	if ((pageValue).split("/").length > 1) {
		var currentAddr = (pageValue).split("/")[1];
		sessionStorage.setItem("currentPageSection", currentAddr);
	}
}

// Retrieve session
function getCurrentPage() {
	//console.log(sessionStorage.getItem("currentPage"));
	return sessionStorage.getItem("currentPage");
}

// Retrieve session
function getCurrentSection() {
	//console.log(sessionStorage.getItem("currentPage"));
	return sessionStorage.getItem("currentPageSection");
}

// Inintialize page
var section = function () {
	if (getCurrentSetion() === null) {
		setPageSection("home");
	}
	return getCurrentSection();
}

// Inintialize page
var page = function () {
	if (getCurrentPage() === null) {
		setPage("home");
	}
	return getCurrentPage();
}

// set fragments
function setFragments(viewName, target) {
	const viewFragment = (viewName).split("/");
	var currentAddr = viewFragment[viewFragment.length - 1];
	if (!boundViews.includes(currentAddr)) {
		$.get("fragments/" + currentAddr + ".html", function (data) {
			$(target).html(data);
			console.log("Load was performed.");
		}).fail(function () {
			retrieveView("error", '#appMain');
		});
	} else {
		$.get("fragments/" + viewFragment[0] + ".html", function (data) {
			$(target).html(data);
			console.log("Load was performed.");
		}).fail(function () {
			retrieveView("error", '#appMain');
		});
	}
}

// set pages
function retrieveView(viewName, target, isTargetSection = false) {
	setPage(viewName);
	setPageSection(viewName)
	setFragments(viewName, target, isTargetSection)

	const viewFragment = (viewName).split("/");
	var title = viewFragment[viewFragment.length - 1];
	$("#title").html(title.substr(0, 1).toUpperCase() + title.substr(1).toLowerCase());
}

const boundViews = ['schedule', 'race'];

function windowRefresher() {
	$(window).on('popstate', function (event) {
		var t = window.location.href.split('/#')[1];
		var s = t.split('/');

		if (getCurrentPage() !== s[s.length - 1]) {
			retrieveView(t, "#appMain");
		}
	});
}

function deleteRow(elementId) {
	$("#" + elementId).remove();
	console.log("removing row");
}

function addRow() {
	rowIndex++;
	var newRow = '<tr id="row_' + rowIndex + '">' +
		'<td><input type="text" class="w-100 form-control border-0"></td>' +
		'<td><select class="form-control border-0"><option>---</option><option>Male</option><option>Female</option></select></td>' +
		'<td><input type="number" class="w-100 form-control border-0" readonly id="age_' + rowIndex + '"></td>' +
		'<td><input type="date" class="w-100 form-control border-0" onchange="setAge(this, \'age_' + rowIndex + '\')"></td>' +
		'<td class="right-borderless"><select class="form-control border-0">' +
		'<option>---</option>' +
		'<option>Extra Small</option>' +
		'<option>Small</option>' +
		'<option>Medium</option>' +
		'<option>Large</option>' +
		'<option>Extra Large</option>' +
		'</select></td>' +
		'<td class="left-borderless"><button class="float-end btn btn-warning btn-sm btn-print-hide" onclick="deleteRow(\'row_' + rowIndex + '\')"><i class="fa-solid fa-trash-can"></i></button></td>'
	'</tr>';

	$('#tableBody').append(newRow);
}

function setAge(element, target) {
	const currentYear = new Date().getFullYear();
	var deadline = Date.parse("March 15, " + currentYear);
	var birthday = Date.parse(element.value);
	const age = Math.floor((deadline - birthday) / (1000 * 60 * 60 * 24 * 365));
	if (age < 0) {
		$("#" + target).addClass("is-invalid");
	} else {
		$("#" + target).removeClass("is-invalid");
	}
	$("#" + target).val(age);

}

function linkMove(name) {
	var alink = $('a.active.nav-link');
	console.log('data', name);
	setActive = false;
	$('#navbarNav ul li a').each(function () {
		if ($(this).attr('href') === name) {
			if (!$(this).hasClass('active')) {
				if ($(this).parent().parent().prev().prop("tagName") === 'A') {
					$(this).parent().parent().prev().addClass('active');
					console.log('Hello', $(this));
				}
				else if ($(this).next().prop("tagName") === 'UL') {
					setActive = true;
					console.log('active', alink.attr('href'));
				} else {
					$(this).addClass('active');
					console.log($(this).prop("tagName"));
				}
			}
		} else {
			$(this).removeClass('active');
		}
	});
	if (setActive) {
		alink.addClass('active');
		console.log(alink);
	}
}

function setActiveLink() {
	console.log("Fixing links");
	$('#navbarNav ul li a').each(function () {
		console.log($(this).attr('href'));
		var elem = $(this);
		$(this).click(function () {
			linkMove(elem.attr('href'));
			//console.log($(this).attr('href'));
		});
	});

}

function setMap() {
	var parentwidth = $('#map').parent().innerWidth()
	$('#map').width(parentwidth);
	$('#map').height(parentwidth * 0.7);
}

function modifiedText(text) {
	return text.replaceAll('&#13;', '<br>');
}

//Sets carousel on the home page
function setCarousel() {
	pageDataCollection('Home-Carousel').then(function (_JsonData) {
		var carouselElementList = '';
		$.each(_JsonData, function (index, value) {
			const activeStatus = index === 0 ? 'active' : '';
			carouselElementList += '<div class="carousel-item ' + activeStatus + '">' +
				'<img src="' + value['Image'] + '" class="d-block w-100" alt="..."></div>';
		});
		// console.log(carouselElementList);
		$('#carouselElementList').append(carouselElementList);
	});
}

//Sets card on the home page
function setCard() {
	pageDataCollection('Home-Card').then(function (_JsonData) {
		var cardList = '';
		$.each(_JsonData, function (index, value) {
			var cardTitle = value['Title']
			var cardText = modifiedText(value['Text'])
			var cardResourceType = value['Resource Type']
			var cardResourceValue = value['Resource Value']
			var cardButtonLink = value['Button Link']
			var cardButtonName = value['Button Name']
			console.log(cardButtonLink);
			var resourceButton = (cardButtonName !== undefined && cardButtonName !== null) ? `<p class="text-center"><button class="btn btn-primary" onclick="retrieveView('${cardButtonLink}', '#appMain')">${cardButtonName}</button></p>` : ``;
			var resourceElement = '';
			if ('Image' === cardResourceType) {
				resourceElement = `<img src="${cardResourceValue}" class="card-img-top" alt="...">`;
			}
			else if ('Map' === cardResourceType) {
				resourceElement = `<iframe id="map" src="${cardResourceValue}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
			} else {
				resourceElement = '';
			}

			var cardContent = `<div class="col d-flex align-self-stretch"><div class="card overflow-hidden ">${resourceElement}` +
				`<div class="card-body"><h5 class="card-title">${cardTitle}</h5><p class="card-text">${cardText}</p>` +
				resourceButton + `</div></div></div>`;
			cardList += cardContent;
		});
		$('#cardList').append(cardList);
	});
}

//load social media
function loadSocial() {
	pageDataCollection('Social').then(function (_JsonData) {
		$.each(_JsonData, function (index, value) {
			var dataName = value['Name'];
			var dataLink = value['Link'];
			if (dataLink !== undefined && dataLink.trim().length > 0) {
				var socialdata = `<a href="${dataLink}" target="_blank" rel="noopener noreferrer" class="no-link-line px-1 ">` +
					`<i class="fab fa-${dataName}-square fa-2x bg-${dataName}"></i></a>`
				$("#socialList").append(socialdata);
			}
		});
		if ($("#socialList").children().length === 0) {
			$("#followUs").addClass('d-none');
			$("#company").removeClass('col-md-8');
		}
	});
}

//load record data
function getTableData(tableData, tableId, record) {

	var tabledata = '';
	$.each(tableData, function (index, value) {
		var selectedMonthName = months[value['Month'] - 1];
		const distance = value['Distance'] !== undefined ? value['Distance'] : 'Unknown';
		tabledata += '<tr class="">' +
			`<td>${distance}</td>` +
			`<td>${value['Age']}</td>` +
			`<td>${value['Time'] !== undefined ? value['Time'] : 'NA'}</td>` +
			`<td>${value['Name'] !== undefined ? value['Name'] : 'NA'}</td>` +
			`<td>${selectedMonthName !== undefined ? selectedMonthName : 'NA'} ${value['Year'] !== undefined ? value['Year'] : ''}</td>` +
			'</tr>';
	});

	$(`#${tableId}Body`).html(tabledata);
	$(`#${tableId}_${record['tableIndex']}`).DataTable();
	$(`#${tableId}_${record['tableIndex']}_filter`).addClass('mb-3');
	$(`#${tableId}_${record['tableIndex']}_length`).addClass('mb-3');
}

//filter the records data
function filterList(record, data, tableId, tableDivId, distanceId, categoryId, yearId = null, monthId = null) {
	var distance = $(`#${distanceId}`).find(":selected").text();
	var category = $(`#${categoryId}`).find(":selected").text();
	var year = yearId === null ? 'All' : $(`#${yearId}`).find(":selected").text();
	var month = monthId === null ? 'All' : $(`#${monthId}`).find(":selected").text();

	console.log(distance, category);
	var tableData = data;
	if (distance !== 'All') {
		tableData = tableData.filter(x => {
			return (distance === 'Unknown' && x['Distance'] === undefined) ||
				(x['Distance'] !== undefined && distance.toUpperCase() === x['Distance'].toUpperCase());		
		});
}
if (category !== 'All') {
	tableData = tableData.filter(x => {
		return x['Category'] !== undefined && category === x['Category'];
	});
}
if (year !== 'All') {
	tableData = tableData.filter(x => {
		return x['Year'] !== undefined && year === x['Year'].toString();
	});
}
if (month !== 'All') {
	tableData = tableData.filter(x => {
		return x['Month'] !== undefined && month === months[x['Month'] - 1];
	});
}



var node = $(`#${tableId}_${record['tableIndex']}`);
const clone = node.clone();
record['tableIndex'] = record['tableIndex']++;
var newId = `${tableId}_${(record['tableIndex'])}`;
clone.attr('id', newId)
node.remove();
$(`#${tableDivId}`).html(clone);
getTableData(tableData, tableId, record);
}

function getFormElementData(data) {
	return {
		"Distance": [...new Set(data.map(x =>
			(x['Distance'] !== undefined) ? x['Distance'] : 'Unknown'))],
		"Year": [...new Set(data.map(x => x['Year']))],
		"Month": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	};
}

function setFormFields(data) {
	data['Month'].forEach(x => {
		$("#resultMonth").append(`<option>${x}</option>`);
	});
	data['Year'].forEach(x => {
		$("#resultYear").append(`<option>${x}</option>`);
	});;
	data['Distance'].forEach(x => {
		$("#resultDistance").append(`<option>${x}</option>`);
	});;
}

//load faqs
function loadFaqs() {
	pageDataCollection('FAQ').then(function (_JsonData) {
		console.log(_JsonData);
		$.each(_JsonData, function (index, value) {
			var dataQuestion = value['Question'];
			var dataAnswer = modifiedText(value['Answer']);

			var faqData =
				`<div class="card p-0 my-3"><div class="card-header m-0"><div class="d-flex justify-content-between">` +
				`<span class="d-block fw-bold">Question: ${dataQuestion}</span><span class="d-block float-right">` +
				`<button id="qbtn_${index}" class="btn btn-secondary btn-sm" type="button" data-bs-toggle="collapse" ` +
				`data-bs-target="#question_${index}" aria-expanded="false" aria-controls="collapseExample">` +
				`<i id="qIcon_${index}" class="fa-solid fa-chevron-down"></i></button></span></div></div>` +
				`<div class="collapse" id="question_${index}"><div class="card-body m-0">` +
				`<p class="card-text">${dataAnswer}</p></div></div></div>`;

			$("#faqList").append(faqData);
			$(`#qbtn_${index}`).click(function () {
				$(`#qIcon_${index}`).toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
			});
		});
	});
}

var pageDataCollection = function (first_sheet_name) {
	// read Excel file and convert to json format using fetch
	return fetch('./fragments/test.xlsx').then(function (res) {
		/* get the data as a Blob */
		if (!res.ok) throw new Error("fetch failed");
		return res.arrayBuffer();
	})
		.then(function (ab) {
			/* parse the data when it is received */
			if (ab !== null) {
				var data = new Uint8Array(ab);
				workbook = XLSX.read(data, {
					type: "array"
				});

				/* Get worksheet */
				var worksheet = workbook.Sheets[first_sheet_name];
				return XLSX.utils.sheet_to_json(worksheet, { raw: true });
			} else {
				return null;
			}

		});
}



$(document).ready(function () {
	$("#title").html('Test title');
	setFragments("header", "#navbar");
	var homepage = 'home';
	const href = window.location.href.split('/#');
	if (href.length > 1) {
		homepage = href[1];
	}
	retrieveView(homepage, "#appMain");

	setFragments("footer", "#appfooter");
	console.log("Doc load")
	windowRefresher();
});