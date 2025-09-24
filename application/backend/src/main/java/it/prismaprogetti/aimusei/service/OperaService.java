package it.prismaprogetti.aimusei.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.prismaprogetti.aimusei.collection.Opera;
import it.prismaprogetti.aimusei.collection.Sintesi;
import it.prismaprogetti.aimusei.model.ModificaFlagSintesiRequest;
import it.prismaprogetti.aimusei.model.ModificaSintesiRequest;
import it.prismaprogetti.aimusei.repository.OperaRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class OperaService {

	@Autowired
	private OperaRepository repository;

	public Opera getOpera(String tag) {
		log.debug("entrata getOpera seachby: "+tag);
		Opera op = repository.findByTag(tag).orElse(null);
		log.debug("response getOpera seachby: "+op);
		return op;
	}

	public void modificaSintesi(ModificaSintesiRequest request) {
		Optional<Opera> optional = repository.findByTag(request.getTag());

		Opera opera = optional.get();
		List<Sintesi> sintesi = opera.getSintesi();

		for (Sintesi sintesi2 : sintesi) {
			if (sintesi2.getDescrizione().equals(request.getDisabilita().toString())) {
				sintesi2.setDescrizione(request.getNuovaSintesi());
			}
		}
		repository.save(opera);

	}

	public void modificaFlagSintesi(ModificaFlagSintesiRequest request) {
		Optional<Opera> optional = repository.findByTag(request.getTag());

		Opera opera = optional.get();
		List<Sintesi> sintesi = opera.getSintesi();

		for (Sintesi sintesi2 : sintesi) {
			if (sintesi2.getDisabilita().equals(request.getDisabilita().toString())) {
				sintesi2.setValidata(request.isValidata());
			}

		}
		repository.save(opera);

	}

}
