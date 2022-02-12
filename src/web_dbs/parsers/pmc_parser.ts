import { ArticleOverview } from '../article'
import type Article from '../article'

export default class PMCArticleParser {
	parse(article: Article): string | void {
		const parser = new DOMParser()
		const doc = parser.parseFromString(article.content, 'text/html')

		return this._parse(doc)
	}

	private _parse(doc: Document): string | void {
		const articleBody = doc.querySelector('.jig-ncbiinpagenav')
		if (!articleBody) {
			return
		}

		// Getting Results section
		for (const h2 of doc.querySelectorAll('h2')) {
			if (h2.textContent.toLowerCase().includes('results')) {
				const resultsSec = h2.parentElement
				return Array.from(resultsSec.children)
					.slice(2)
					.map((element) => element.textContent)
					.join(' ')
			}
		}
	}

  /** Getting article overview */
	getArticleOverview(article: Article): ArticleOverview {
		const parser = new DOMParser()
		const doc = parser.parseFromString(article.content, 'text/html')

		const title = doc.querySelector('h1.content-title').textContent

		// Getting Abstract section
		let body: string
		for (const h2 of doc.querySelectorAll('h2')) {
			if (h2.textContent.toLowerCase().includes('abstract')) {
				const abstract = h2.parentElement
				body = abstract.children[2].textContent
				break
			}
		}

		return new ArticleOverview(article.id, title, body)
	}
}
