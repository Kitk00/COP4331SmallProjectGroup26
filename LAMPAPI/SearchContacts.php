<?php
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	if ($inData == null) 
	{
		returnWithError("Input Data cannot be NULL (likely userId missing)");
		return;
	}

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("select ID, FirstName, LastName, Phone, Email from Contacts where (FirstName like ? or LastName like ?) and UserID=?");
		$search = "%" . $inData["search"] . "%";
		$stmt->bind_param("sss", $search, $search, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			//$searchResults .= '{"ID":' . $row["ID"] . '"' . $row["FirstName"] . " " . $row["LastName"] . " " . $row["Phone"] . " " . $row["Email"] . '"';
			$searchResults .= '{"ID":' . $row["ID"] . ',"FirstName":"' . $row["FirstName"] . '","LastName":"' . $row["LastName"] . '","Phone":"' . $row["Phone"] . '","Email":"' . $row["Email"] . '"}';

		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
		$stmt->close();
		$conn->close();
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>