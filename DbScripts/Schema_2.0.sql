

GO
/****** Object:  StoredProcedure [dbo].[Employee_Save_BasicInfo]    Script Date: 7/25/2022 10:00:25 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[Employee_Save_BasicInfo]
	@Id BIGINT,
	@EmployeeCode NVARCHAR(100),
	@EmployeeName NVARCHAR(150),
	@LoginID NVARCHAR(10),
	@EmployeePassword nvarchar(150),
	@PortalUserId UNIQUEIDENTIFIER,
	@EmployeeStatusId INT,
	@HasAccessQrCodeScan BIT,
	@DesignationId INT,
	@DepartmentId INT,
	@MobileNo NVARCHAR(50),
	@ProjectId INT,
	@NationalityId INT,
	@DateOfBirth DATETIME,
	@GenderId INT,
	@PassportNo NVARCHAR(150),
	@PassportIssueDate DATETIME,
	@PassportExpiryDate DATETIME,
	@QID NVARCHAR(50),
	@QIDExpiryDate DATETIME,
	@WorkingCompanyId INT,
	@SponsorshipId INT,
	@VisaNo NVARCHAR(50),
	@VisaExpirayDate DATETIME,
	@WorkLocationId INT,
	@CompanyAccomodation NVARCHAR(150),
	@HealthCardNo NVARCHAR(150),
	@HealthCardExpiryDate DATETIME,
	@Insurance  NVARCHAR(150),
	@InsuranceExpirayDate  DATETIME,
	@FoodHandling  NVARCHAR(150),
	@FoodhandlingIssueDate DATETIME,
	@FoodhandlingExpiryDate DATETIME,
	@LastWorkingDate DATETIME,
	@DateOfJoining DATETIME,
	@ActionAt DATETIME,
	@ActionById uniqueidentifier,
	@ImageFileName nvarchar(50),
	@ReturnId INT OUT
AS
BEGIN
	SET NOCOUNT ON;

	IF  NOT EXISTS  (SELECT * FROM Employee WHERE Id=@Id)
		BEGIN
		IF NOT EXISTS(SELECT * FROM UserCredentials C WHERE C.LoginID=@LoginID)
		BEGIN
		  INSERT INTO UserCredentials(Id,FullName,Email,ContactNo,LoginID,Password,UserTypeId,IsActive,CreatedAt,CompanyId)
		  VALUES(@PortalUserId,@EmployeeName,NULL,@MobileNo,@LoginID,@EmployeePassword,5,1,@ActionAt,@WorkingCompanyId)
		END
		ELSE
		BEGIN
		 SELECT TOP 1 @PortalUserId=C.Id FROM UserCredentials C WHERE C.LoginID=@EmployeeCode
		END
			INSERT INTO Employee(EmployeeCode,EmployeeName,LoginID,StatusId,DepartmentId,DesignationId,MobileNo,
			ProjectId,NationalityId,DateOfBirth,GenderId,PassportNo,PassportIssueDate,PassportExpiryDate,
			QID,QIDExpiryDate,WorkingCompanyId,SponsorshipId,VisaNo,VisaExpirayDate,WorkLocationId,CompanyAccomodation,HealthCardNo,
			HealthCardExpiryDate,Insurance,InsuranceExpirayDate,FoodHandling,FoodhandlingIssueDate,FoodhandlingExpiryDate,
			LastWorkingDate,DateOfJoining,CreatedAt,CreatedById,PortalUserId,ImageFileName,HasAccessQrCodeScan)
			VALUES(@EmployeeCode,@EmployeeName,@LoginID,@EmployeeStatusId,@DepartmentId,@DesignationId,@MobileNo,
			@ProjectId,@NationalityId,@DateOfBirth,@GenderId,@PassportNo,@PassportIssueDate,@PassportExpiryDate,
			@QID,@QIDExpiryDate,@WorkingCompanyId,@SponsorshipId,@VisaNo,@VisaExpirayDate,@WorkLocationId,@CompanyAccomodation,@HealthCardNo,
			@HealthCardExpiryDate,@Insurance,@InsuranceExpirayDate,@FoodHandling,@FoodhandlingIssueDate,@FoodhandlingExpiryDate,
			@LastWorkingDate,@DateOfJoining,@ActionAt,@ActionById,@PortalUserId,@ImageFileName,@HasAccessQrCodeScan)
			SET @ReturnId=SCOPE_IDENTITY()
			END				
	ELSE
		BEGIN
					UPDATE Employee SET 
						EmployeeCode=@EmployeeCode,
						EmployeeName=@EmployeeName,
						DepartmentId=@departmentId,
						DesignationId=@DesignationId,
						StatusId=@EmployeeStatusId,
						MobileNo=@MobileNo,
						ProjectId=@ProjectId,
						NationalityId=@NationalityId,
						DateOfBirth=@DateOfBirth,
						GenderId=@GenderId,
						PassportNo=@PassportNo,
						PassportIssueDate=@PassportIssueDate,
						PassportExpiryDate=@PassportExpiryDate,
						QID=@QID,
						QIDExpiryDate=@QIDExpiryDate,
						WorkingCompanyId=@WorkingCompanyId,
						SponsorshipId=@SponsorshipId,
						VisaNo=@VisaNo,
						VisaExpirayDate=@VisaExpirayDate,
						WorkLocationId=@WorkLocationId,
						CompanyAccomodation=@CompanyAccomodation,
						HealthCardNo=@HealthCardNo,
						HealthCardExpiryDate=@HealthCardExpiryDate,
						Insurance=@Insurance,
						InsuranceExpirayDate=@InsuranceExpirayDate,
						FoodHandling=@FoodHandling,

						FoodhandlingIssueDate=@FoodhandlingIssueDate,
						FoodhandlingExpiryDate=@FoodhandlingExpiryDate,
						LastWorkingDate=@LastWorkingDate,
						DateOfJoining=@DateOfJoining,
						ImageFileName=@ImageFileName,
						UpdatedAt=@ActionAt,
						UpdatedById=@ActionById,
						HasAccessQrCodeScan=@HasAccessQrCodeScan,
						LoginID=@LoginID
						
					WHERE Id=@Id
							
					SET @ReturnId=@Id

				   UPDATE UserCredentials SET LoginID=@LoginID,FullName=@EmployeeName WHERE Id=@PortalUserId
		END
END

GO
