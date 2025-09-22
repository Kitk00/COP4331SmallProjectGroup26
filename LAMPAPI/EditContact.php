<?php
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=? AND UserID=?");
		$stmt->bind_param("ssssii", $inData["firstName"], $inData["lastName"], $inData["phone"], $inData["email"], $inData["id"], $inData["userId"]);
		if( $inData["firstName"] != "" && $inData["lastName"] != "" && $inData["phone"] != ""  && $inData["email"] != "" && $inData["userId"] != "" && $inData["id"] != "")
		{
			if( $stmt->execute())
			{
				$stmt->close();
				$conn->close();
				returnWithError(""); 
			}
			else
			{
				returnWithError("Could Not Update Contact");
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