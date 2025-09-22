package it.prismaprogetti.aimusei.collection;

import java.time.LocalDate;

import lombok.Data;

@Data
public class Sintesi {

	private String disabilita;
	private String descrizione;
	private boolean validata;
	private String editor;
	private LocalDate lastUpdate; //system date

	
	
	//TODO modifica nomi 
//	{
//		   public record SimplifiedText(
//		       @NotBlank String tipo,
//		       @NotBlank String text,
//		       @NotBlank String editor,
//		       @Min(1) int version
//		   )  
//		 
}
