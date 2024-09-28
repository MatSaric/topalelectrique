import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Printer, Send, Plus, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const PlateformeFacturation = () => {
  const [facture, setFacture] = useState({
    numeroFacture: '',
    date: new Date().toISOString().split('T')[0],
    dateDue: '',
    nomClient: '',
    adresseClient: '',
    articles: [{ description: '', quantite: '', prixUnitaire: '', montant: '' }],
  });

  const TPS = 0.05;
  const TVQ = 0.09975;

  const calculerTotaux = () => {
    const sousTotal = facture.articles.reduce((sum, item) => sum + (parseFloat(item.montant) || 0), 0);
    const tps = sousTotal * TPS;
    const tvq = sousTotal * TVQ;
    const total = sousTotal + tps + tvq;
    return { sousTotal, tps, tvq, total };
  };

  const gererChangementInput = (e, index) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      const nouveauxArticles = [...facture.articles];
      nouveauxArticles[index] = { ...nouveauxArticles[index], [name]: value };
      if (name === 'quantite' || name === 'prixUnitaire') {
        const quantite = parseFloat(nouveauxArticles[index].quantite) || 0;
        const prixUnitaire = parseFloat(nouveauxArticles[index].prixUnitaire) || 0;
        nouveauxArticles[index].montant = (quantite * prixUnitaire).toFixed(2);
      }
      setFacture({ ...facture, articles: nouveauxArticles });
    } else {
      setFacture({ ...facture, [name]: value });
    }
  };

  const ajouterArticle = () => {
    setFacture({
      ...facture,
      articles: [...facture.articles, { description: '', quantite: '', prixUnitaire: '', montant: '' }],
    });
  };

  const supprimerArticle = (index) => {
    const nouveauxArticles = facture.articles.filter((_, i) => i !== index);
    setFacture({ ...facture, articles: nouveauxArticles });
  };

  const { sousTotal, tps, tvq, total } = calculerTotaux();

  const genererApercu = () => {
    const contenuApercu = `
      <html>
        <head>
          <title>Aperçu Facture - Topal Électrique</title>
          <link href="https://fonts.googleapis.com/css2?family=Questrial&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Questrial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f97316; color: white; padding: 20px; margin-bottom: 20px; }
            .header h1 { margin: 0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { text-align: right; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Topal Électrique</h1>
              <p>Tél: (514) 246-8328 | Courriel: topalelectrique@gmail.com</p>
            </div>
            <h2>Facture</h2>
            <p><strong>Numéro de Facture:</strong> ${facture.numeroFacture}</p>
            <p><strong>Date:</strong> ${facture.date}</p>
            <p><strong>Date d'échéance:</strong> ${facture.dateDue}</p>
            <p><strong>Client:</strong> ${facture.nomClient}</p>
            <p><strong>Adresse:</strong> ${facture.adresseClient}</p>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantité</th>
                  <th>Prix Unitaire</th>
                  <th>Montant</th>
                </tr>
              </thead>
              <tbody>
                ${facture.articles.map(article => `
                  <tr>
                    <td>${article.description}</td>
                    <td>${article.quantite}</td>
                    <td>${article.prixUnitaire}</td>
                    <td>${article.montant}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">
              <p><strong>Sous-total:</strong> $${sousTotal.toFixed(2)}</p>
              <p><strong>TPS (5%):</strong> $${tps.toFixed(2)}</p>
              <p><strong>TVQ (9,975%):</strong> $${tvq.toFixed(2)}</p>
              <p><strong>Total:</strong> $${total.toFixed(2)}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const nouvelOnglet = window.open();
    nouvelOnglet.document.write(contenuApercu);
    nouvelOnglet.document.close();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white">
      <CardHeader className="bg-orange-500 text-white p-6">
        <h2 className="text-3xl font-bold font-questrial">Topal Électrique</h2>
        <p className="mt-2 font-questrial">Tél: (514) 246-8328 | Courriel: topalelectrique@gmail.com</p>
        <h1 className="text-2xl font-semibold mt-6 font-questrial">Facture</h1>
      </CardHeader>
      <CardContent className="p-6 pt-10 font-questrial">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Numéro de Facture</label>
            <Input name="numeroFacture" value={facture.numeroFacture} onChange={gererChangementInput} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <Input type="date" name="date" value={facture.date} onChange={gererChangementInput} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date d'échéance</label>
            <Input type="date" name="dateDue" value={facture.dateDue} onChange={gererChangementInput} />
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Facturer à :</h3>
          <Input name="nomClient" placeholder="Nom du Client" value={facture.nomClient} onChange={gererChangementInput} className="mb-2" />
          <Input name="adresseClient" placeholder="Adresse du Client" value={facture.adresseClient} onChange={gererChangementInput} />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2 w-1/2">Description</th>
                <th className="text-right p-2 w-1/6">Quantité</th>
                <th className="text-right p-2 w-1/6">Prix Unitaire</th>
                <th className="text-right p-2 w-1/6">Montant</th>
                <th className="p-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {facture.articles.map((article, index) => (
                <tr key={index}>
                  <td className="p-2">
                    <Textarea
                      name="description"
                      value={article.description}
                      onChange={(e) => gererChangementInput(e, index)}
                      className="w-full min-h-[60px] resize-y"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      name="quantite"
                      value={article.quantite}
                      onChange={(e) => gererChangementInput(e, index)}
                      className="text-right w-full"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      name="prixUnitaire"
                      value={article.prixUnitaire}
                      onChange={(e) => gererChangementInput(e, index)}
                      className="text-right w-full"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      name="montant"
                      value={article.montant}
                      readOnly
                      className="text-right w-full"
                    />
                  </td>
                  <td className="p-2">
                    <Button onClick={() => supprimerArticle(index)} variant="ghost" className="h-full">
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <Button onClick={ajouterArticle} className="mb-4"><Plus size={16} className="mr-2" /> Ajouter un Article</Button>
        
        <div className="flex justify-end">
          <div className="w-1/2">
            <div className="flex justify-between mb-2">
              <span>Sous-total :</span>
              <span>${sousTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>TPS (5%) :</span>
              <span>${tps.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>TVQ (9,975%) :</span>
              <span>${tvq.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total :</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col p-6 font-questrial">
        <div className="mb-4 text-sm">
          <h4 className="font-semibold mb-2">Termes et Conditions :</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Paiement :</strong> Dû dans les 30 jours. Pénalité de 1,5 % par mois de retard.</li>
            <li><strong>Garantie :</strong> 12 mois sur la main-d'œuvre. Ne couvre pas les dommages dus à une mauvaise utilisation ou à des facteurs externes.</li>
            <li><strong>Travaux Supplémentaires :</strong> Tout travail additionnel doit être approuvé et sera facturé séparément.</li>
            <li><strong>Conformité :</strong> Travaux effectués selon les normes électriques en vigueur. Le client est responsable de la sécurité du site.</li>
            <li><strong>Matériaux :</strong> Non remboursables si personnalisés ou spécialisés.</li>
            <li><strong>Annulation :</strong> Préavis de 48 heures requis, sinon des frais de [montant] s'appliquent.</li>
            <li><strong>Responsabilité :</strong> Non responsable des problèmes préexistants ou des conditions imprévues.</li>
            <li><strong>Litiges :</strong> Résolution par médiation avant toute action légale.</li>
          </ul>
        </div>
        <div className="flex justify-between w-full">
          <Button onClick={genererApercu}>Aperçu</Button>
          <Button onClick={() => console.log('Imprimer la facture:', facture)} className="flex items-center">
            <Printer className="mr-2" size={16} /> Imprimer
          </Button>
          <Button onClick={() => console.log('Envoyer la facture:', facture)} className="flex items-center">
            <Send className="mr-2" size={16} /> Envoyer
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PlateformeFacturation;
