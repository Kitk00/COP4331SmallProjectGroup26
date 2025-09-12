<?php
	//ini_set('display_errors', 1);
	//ini_set('display_startup_errors', 1);
	//error_reporting(E_ALL);

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Phone, Email, UserID) VALUES(?,?,?,?,?)");
		$stmt->bind_param("sssss", $inData["firstName"], $inData["lastName"], $inData["phone"], $inData["email"], $inData["userId"]);
		if( $inData["firstName"] != "" && $inData["lastName"] != "" && $inData["phone"] != ""  && $inData["email"] != "" && $inData["userId"] != "")
		{
			if( $stmt->execute())
			{
				$stmt->close();
				$conn->close();
				returnWithError(""); 
			}
			else
			{
				returnWithError("Could Not Create Contact");
			}
		}
		else
		{
			returnWithError("Any Field Cannot Be NULL");
		}
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>