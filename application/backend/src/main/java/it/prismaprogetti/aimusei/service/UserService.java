package it.prismaprogetti.aimusei.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.prismaprogetti.aimusei.model.Disabilita;
import it.prismaprogetti.aimusei.repository.OperaRealTimeRepository;
import it.prismaprogetti.aimusei.repository.OperaRepository;

@Service
public class UserService {

	@Autowired
	private OperaRepository repository;

	@Autowired
	private OperaRealTimeRepository repositoryRealTime;

	public String getDescrizioneOpera(String nomeOpera) {
		return repository.findDescrizioneByNome(nomeOpera).orElse(null);
	}

	public String getSintesi(String nomeOpera, Disabilita disabilita) {

		return repository.findSintesiByNome(nomeOpera, disabilita.toString()).orElse(null);

	}

	public String elabora(String nomeOpera, String disabilita) {

		if (!disabilita.equals("null")) {

			String sintesi = repositoryRealTime.findSintesiByNome(nomeOpera, disabilita.toUpperCase()).get();
			return sintesi;

		} else {
			
			String descrizione = repositoryRealTime.findDescrizioneByNome(nomeOpera).get();
			 
			return descrizione;

		}

	}

}
