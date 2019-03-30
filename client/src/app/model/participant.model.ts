export class Participant {
  public firstName: string;
  public lastName: string;
  public birthDate: string;
  public email: string;
  public phone: string;
  public city: string;
  public nationality: string;
  public numberOfYearInTheOrganisation: number;
  public numberOfParticipation: number;
  public localChurch: string;
  public imageUrl: string;


  constructor(
    firstName: string,
    lastName: string,
    birthDate: string,
    email: string,
    phone: string,
    city: string,
    nationality: string,
    numberOfYearInTheOrganisation: number,
    numberOfParticipation: number,
    localChurch: string,
    imageUrl: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.email = email;
    this.phone = phone;
    this.city = city;
    this.nationality = nationality;
    this.numberOfYearInTheOrganisation = numberOfYearInTheOrganisation;
    this.numberOfParticipation = numberOfParticipation;
    this.localChurch = localChurch;
    this.imageUrl = imageUrl;
  }
}
