package it.prismaprogetti.aimusei.model;

import java.util.List;

import it.prismaprogetti.aimusei.collection.Sintesi;
import lombok.Data;

@Data
public class TextGeneratedResponse {

	private String engineLLM;
	private List<Sintesi> textSimplified;

}
