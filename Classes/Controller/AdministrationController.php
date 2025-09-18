<?php

namespace Toumoro\TmQaTools\Controller;

use Psr\Http\Message\ResponseInterface;
use TYPO3\CMS\Backend\Template\ModuleTemplate;
use TYPO3\CMS\Backend\Template\ModuleTemplateFactory;
use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

class AdministrationController extends ActionController
{
    protected ModuleTemplate $moduleTemplate;

    protected ModuleTemplateFactory $moduleTemplateFactory;

    public function __construct(ModuleTemplateFactory $moduleTemplateFactory)
    {
        $this->moduleTemplateFactory = $moduleTemplateFactory;
    }

    /**
    * Initializes the controller and sets needed vars.
    *
    * @throws UnexpectedTYPO3SiteInitializationException
    * @throws DBALException
    */
    protected function initializeAction(): void
    {
        $this->moduleTemplate = $this->moduleTemplateFactory->create($this->request);
    }

    /**
     * @return ResponseInterface
     */
    public function indexAction(): ResponseInterface
    {
        return $this->moduleTemplate->renderResponse('Administration/Index');
    }

    /**
     * @return ResponseInterface
     */
    public function executeAction(): ResponseInterface
    {
        return $this->moduleTemplate->renderResponse('Administration/Execute');
    }
}
