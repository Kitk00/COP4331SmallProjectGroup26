
<?php
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
	
	
	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        $check = $conn->prepare("SELECT Login FROM Users WHERE Login=?");
        $check->bind_param("s", $inData["login"] );
		$check->execute();
		$result = $check->get_result();

		if( $row = $result->fetch_assoc()  )
		{
            returnWithError("User already exists");
		}
		else
		{
            $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"]);

			if( $inData["firstName"] != "" && $inData["lastName"] != "")
		    {
                if ( $stmt->execute() )
				{
					$userId = $conn->insert_id;
                	if( $userId > 0)
					{
						returnWithInfo( $inData["firstName"], $inData["lastName"], $userId );
					}
					else
					{
						returnWithError("Could Not Find ID");
					}
				}
                else
                {
                    returnWithError("Could Not Create Account");
                }
                
		    }
		    else
		    {
			    returnWithError("First/Last Name Cannot Be NULL");
		    }

            $stmt->close();
		}

		$check->close();
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
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
