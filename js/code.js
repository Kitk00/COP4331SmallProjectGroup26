//const urlBase = 'http://159.89.159.198/LAMPAPI';
//const urlBase = 'http://134.209.2.58/LAMPAPI';
// const urlBase = 'http://165.227.218.156/LAMPAPI';
const urlBase = 'http://104.248.77.74/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					const resultElem = document.getElementById("loginResult");
					resultElem.classList.remove("fade-out");
					setTimeout(function() {
						resultElem.classList.add("fade-out");
						setTimeout(function() {
							resultElem.innerHTML = "";
							resultElem.classList.remove("fade-out");
						}, 500);
					}, 3000);

					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contact.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doSignUp()
{
	userId = 0;
	
	let firstName = document.getElementById("signUpFirstName").value;
	let lastName = document.getElementById("signUpLastName").value;
	let login = document.getElementById("signUpName").value;
	let password = document.getElementById("signUpPassword").value;
	let confirmPassword = document.getElementById("confirmPassword").value;
//	var hash = md5( password );
	
	document.getElementById("signUpResult").innerHTML = "";

	if(!firstName || !lastName || !login || !password || !confirmPassword)
	{
		document.getElementById("signUpResult").innerHTML = "All fields required";
		const resultElem = document.getElementById("signUpResult");
		resultElem.classList.remove("fade-out");
		setTimeout(function() {
			resultElem.classList.add("fade-out");
			setTimeout(function() {
				resultElem.innerHTML = "";
				resultElem.classList.remove("fade-out");
			}, 500);
		}, 3000);

		return;
	}

	if(password !== confirmPassword) {
		document.getElementById("signUpResult").innerHTML = "Passwords do not match";
		const resultElem = document.getElementById("signUpResult");
		resultElem.classList.remove("fade-out");
		setTimeout(function() {
			resultElem.classList.add("fade-out");
			setTimeout(function() {
				resultElem.innerHTML = "";
				resultElem.classList.remove("fade-out");
			}, 500);
		}, 3000);

		return;
	}
	
	let tmp = {firstName:firstName,lastName:lastName,login:login,password:password,confirmPassword:confirmPassword};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/SignUp.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("signUpResult").innerHTML = "Username Not Available";
					const resultElem = document.getElementById("signUpResult");
					resultElem.classList.remove("fade-out");
					setTimeout(function() {
						resultElem.classList.add("fade-out");
						setTimeout(function() {
							resultElem.innerHTML = "";
							resultElem.classList.remove("fade-out");
						}, 500);
					}, 3000);

					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contact.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("signUpResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	document.getElementById("contactEditResult").innerHTML = "";
	document.getElementById("contactDeleteResult").innerHTML = "";
	document.getElementById("contactAddResult").innerHTML = "";
	
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let phone = document.getElementById("phone").value;
	let email = document.getElementById("email").value;

	if(!firstName || !lastName || !phone || !email)
	{
		document.getElementById("contactAddResult").innerHTML = "All fields required";
		return;
	}

	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {firstName:firstName,lastName:lastName,phone:phone,email:email,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";

				document.getElementById("firstName").value = "";
				document.getElementById("lastName").value = "";
				document.getElementById("phone").value = "";
				document.getElementById("email").value = "";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let tableBody = document.getElementById("tbody");
	tableBody.innerHTML= "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );

				setTimeout(function() {document.getElementById("contactSearchResult").innerHTML = "";}, 3000);
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					let contact = jsonObject.results[i];
					let row = tableBody.insertRow();

					let firstNameCell = row.insertCell(0);
					let lastNameCell = row.insertCell(1);
					let emailCell = row.insertCell(2);
					let phoneCell = row.insertCell(3);
					let buttonsCell = row.insertCell(4);
					
					firstNameCell.className = "tableCells";
   					lastNameCell.className = "tableCells";
   					emailCell.className = "tableCells";
   					phoneCell.className = "tableCells";
					buttonsCell.className = "tableCells buttonCells"

					firstNameCell.textContent = contact.FirstName;
   					lastNameCell.textContent = contact.LastName;
   					emailCell.textContent = contact.Email;
   					phoneCell.textContent = contact.Phone;

					let editButton = document.createElement("button");
					editButton.type = "button";
					editButton.className = "contactButton";
					editButton.textContent = "Edit";
					editButton.onclick = function() 
					{
						selectContact(contact.FirstName, contact.LastName, contact.Phone, contact.Email, contact.ID);
					};

					let deleteButton = document.createElement("button");
					deleteButton.type = "button";
					deleteButton.className = "contactButton";
					deleteButton.textContent = "Delete";
					deleteButton.onclick = function() 
					{
						deleteContact(contact.ID);
					};

					buttonsCell.appendChild(editButton);
					buttonsCell.appendChild(deleteButton);
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}

function editContact()
{
	document.getElementById("contactEditResult").innerHTML = "";
	document.getElementById("contactDeleteResult").innerHTML = "";
	document.getElementById("contactAddResult").innerHTML = "";
	
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let phone = document.getElementById("phone").value;
	let email = document.getElementById("email").value;

	if(!firstName || !lastName || !phone || !email)
	{
		document.getElementById("contactEditResult").innerHTML = "One fields required";
		return;
	}

	if(!window.currentContactId)
	{
		document.getElementById("contactEditResult").innerHTML = "Select a contact to edit";
		return;
	}
	document.getElementById("contactEditResult").innerHTML = "";

	let tmp = {id:window.currentContactId,firstName:firstName,lastName:lastName,phone:phone,email:email,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/EditContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactEditResult").innerHTML = "Contact has been updated";

				document.getElementById("firstName").value = "";
				document.getElementById("lastName").value = "";
				document.getElementById("phone").value = "";
				document.getElementById("email").value = "";
				window.currentContactId = null;
				searchContact();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactEditResult").innerHTML = err.message;
	}
	
}

function selectContact(firstName, lastName, phone, email, contactId)
{
	document.getElementById("contactEditResult").innerHTML = "";
	document.getElementById("contactDeleteResult").innerHTML = "";
	document.getElementById("contactAddResult").innerHTML = "";
	
	document.getElementById("firstName").value = firstName;
	document.getElementById("lastName").value = lastName;
	document.getElementById("phone").value = phone;
	document.getElementById("email").value = email;	

	window.currentContactId = contactId;
}

function deleteContact(contactId)
{
	document.getElementById("contactEditResult").innerHTML = "";
	document.getElementById("contactDeleteResult").innerHTML = "";
	document.getElementById("contactAddResult").innerHTML = "";
	
	window.currentContactId = contactId;
	
	if(!window.currentContactId)
	{
		document.getElementById("contactDeleteResult").innerHTML = "Select a contact to delete";
		return;
	}
	document.getElementById("contactDeleteResult").innerHTML = "";

	let tmp = {id:window.currentContactId,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/DeleteContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted";

				window.currentContactId = null;
				searchContact();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactDeleteResult").innerHTML = err.message;
	}
	
}