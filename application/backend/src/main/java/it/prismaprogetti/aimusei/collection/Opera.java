package it.prismaprogetti.aimusei.collection;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "opera")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Opera {
	@Id
	private String id;
	@Field("nome")
	private String nome;
	private String descrizione;
	private int version; 
	private String hash;
	private String tag;
	private LocalDate lastUpdate;
	private List<Sintesi> sintesi;
	
	
	
//	 @NotBlank
//	   String tag,     // e.g. "MUS-SEZ1-ITA"
//	 
//	   @Min(1)
//	  int vers,       // versione suggerita
//	 
//	  @NotBlank
//	  String contentText,  // testo originale
//	 
//	  @NotBlank
//	   String contentHash,  // hash per verifica
//	 
//	   @NotEmpty
//	   @Valid
//	   List<SimplifiedText> simplified

//	private Sintesi sintesi_dislessia;
//	private Sintesi sintesi_discalculia;

}
