package it.prismaprogetti.aimusei.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import it.prismaprogetti.aimusei.collection.Opera;
import it.prismaprogetti.aimusei.collection.Sintesi;
import it.prismaprogetti.aimusei.exception.InvalidOpenAIKeyException;
import it.prismaprogetti.aimusei.model.Disabilita;
import it.prismaprogetti.aimusei.model.ElaboraTestiDisabilitaRequest;
import it.prismaprogetti.aimusei.repository.OperaRepository;

@Service
public class BackofficeService {

	@Autowired
	private OpenAiService openAiService;

	@Autowired
	private OperaRepository repository;

	public Map<Disabilita, String> elaboraTestiDisabilita(ElaboraTestiDisabilitaRequest request)
			throws InvalidOpenAIKeyException, BadRequestException {
		checkTesto(request.getDescrizione());
		Map<Disabilita, String> testiElaboratiPerDisabilita = new HashMap<>();

		Opera opera = new Opera();
		opera.setNome(request.getTitolo());
		opera.setDescrizione(request.getDescrizione());
		opera.setTag(request.getTag());

		Sintesi sintesiDislessia = new Sintesi();
		sintesiDislessia.setDisabilita(Disabilita.DISLESSIA.toString());
		sintesiDislessia.setDescrizione(openAiService.getDislessiaMock());
		sintesiDislessia.setValidata(false);

		Sintesi sintesiDiscalculia = new Sintesi();
		sintesiDiscalculia.setDisabilita(Disabilita.DISCALCULIA.toString());
		sintesiDiscalculia.setDescrizione(openAiService.getDiscalculiaMock());
		sintesiDiscalculia.setValidata(false);

		opera.setSintesi(List.of(sintesiDiscalculia, sintesiDislessia));

		repository.save(opera);

		testiElaboratiPerDisabilita.put(Disabilita.DISLESSIA, openAiService.getDislessiaMock());
		testiElaboratiPerDisabilita.put(Disabilita.DISCALCULIA, openAiService.getDiscalculiaMock());

//		for (Disabilita disabilita : request.getDisabilita()) {
//
//			testiElaboratiPerDisabilita.put(disabilita, openAiService.prompt(testo+disabilita.getPrompt()));
//		}
		return testiElaboratiPerDisabilita;
	}

	private void checkTesto(String testo) throws BadRequestException {
		if (!StringUtils.hasText(testo)) {
			throw new BadRequestException("Testo vuoto");
		}
	}
}