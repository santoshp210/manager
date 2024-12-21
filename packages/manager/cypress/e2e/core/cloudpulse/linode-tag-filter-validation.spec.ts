/**
 * @file Integration Tests for CloudPulse Linode Dashboard with Dynamic Mocking.
 */

import { mockAppendFeatureFlags } from 'support/intercepts/feature-flags';
import {
  mockCreateCloudPulseJWEToken,
  mockGetCloudPulseDashboard,
  mockCreateCloudPulseMetrics,
  mockGetCloudPulseDashboards,
  mockGetCloudPulseMetricDefinitions,
  mockGetCloudPulseServices,
} from 'support/intercepts/cloudpulse';
import { ui } from 'support/ui';
import { widgetDetails } from 'support/constants/widgets';
import {
  accountFactory,
  cloudPulseMetricsResponseFactory,
  dashboardFactory,
  dashboardMetricFactory,
  linodeFactory,
  regionFactory,
  widgetFactory,
} from 'src/factories';
import { mockGetAccount } from 'support/intercepts/account';
import { mockGetLinodes } from 'support/intercepts/linodes';
import { mockGetUserPreferences } from 'support/intercepts/profile';
import { mockGetRegions } from 'support/intercepts/regions';
import { generateRandomMetricsData } from 'support/util/cloudpulse';
import { Flags } from 'src/featureFlags';

const timeDurationToSelect = 'Last 24 Hours';
const flags: Partial<Flags> = {
  aclp: { enabled: true, beta: true },
  aclpResourceTypeMap: [
    {
      dimensionKey: 'LINODE_ID',
      maxResourceSelections: 10,
      serviceType: 'linode',
      supportedRegionIds: 'us-ord',
    },
    {
      dimensionKey: 'cluster_id',
      maxResourceSelections: 10,
      serviceType: 'dbaas',
      supportedRegionIds: '',
    },
  ],
};

const { metrics, id, serviceType, dashboardName, region } = widgetDetails.linode;

const dashboard = dashboardFactory.build({
  label: dashboardName,
  service_type: serviceType,
  widgets: metrics.map(({ title, yLabel, name, unit }) =>
    widgetFactory.build({
      label: title,
      y_label: yLabel,
      metric: name,
      unit,
    })
  ),
});

const metricDefinitions = {
  data: metrics.map(({ title, name, unit }) =>
    dashboardMetricFactory.build({
      label: title,
      metric: name,
      unit,
    })
  ),
};

const linodes = [
  linodeFactory.build({
    tags: ['tag-2', 'tag-3'],
    label: 'linodeWithTagsTag2AndTag3',
    id: 1,
    region: 'us-ord',
  }),
  linodeFactory.build({
    tags: ['tag-3', 'tag-4'],
    label: 'linodeWithTagsTag3AndTag4',
    id: 2,
    region: 'us-ord',
  }),
  linodeFactory.build({
    label: 'linodeNoTags',
    id: 3,
    region: 'us-ord',
  }),
];

const mockAccount = accountFactory.build();

const mockRegion = regionFactory.build({
  capabilities: ['Linodes'],
  id: 'us-ord',
  label: 'Chicago, IL',
});

const metricsAPIResponsePayload = cloudPulseMetricsResponseFactory.build({
  data: generateRandomMetricsData(timeDurationToSelect, '5 min'),
});

describe('Integration Tests for Linode Dashboard with Dynamic Mocking', () => {
  beforeEach(() => {
    mockAppendFeatureFlags(flags);
    mockGetAccount(mockAccount);
    mockGetCloudPulseMetricDefinitions(serviceType, metricDefinitions);
    mockGetCloudPulseDashboards(serviceType, [dashboard]).as('fetchDashboard');
    mockGetCloudPulseServices(serviceType).as('fetchServices');
    mockGetLinodes(linodes).as('fetchResources');
    mockGetCloudPulseDashboard(id, dashboard);
    mockCreateCloudPulseJWEToken(serviceType);
    mockCreateCloudPulseMetrics(serviceType, metricsAPIResponsePayload).as('getMetrics');
    mockGetRegions([mockRegion]);
    mockGetUserPreferences({});
  });

  it('Select a resource without applying any tags', () => {
    cy.visitWithLogin('monitor');
    cy.wait(['@fetchServices', '@fetchDashboard']);

    ui.autocomplete.findByLabel('Dashboard').type(dashboardName);
    ui.autocompletePopper.findByTitle(dashboardName).click();

    ui.regionSelect.find().type(`${region}{enter}`);
    cy.wait('@fetchResources');

      mockGetLinodes([linodes[0]]);
    ui.autocomplete.findByLabel('Resources').type(`${linodes[0].label}{enter}`).click();

   // Expand the applied filters section
     ui.button.findByTitle('Filters').should('be.visible').click();

     // Verify that the applied filters
     cy.get('[data-qa-applied-filter-id="applied-filter"]')
       .should('be.visible')
       .within(() => {
         cy.get(`[data-qa-value="Region US, Chicago, IL"]`)
           .should('be.visible')
           .should('have.text', 'US, Chicago, IL');

           cy.get(`[data-qa-value="Resources ${linodes[0].label}"]`)
           .should('be.visible')
           .should('have.text', linodes[0].label);

 
       });
  });

  it('Select a resource, tag  and verify the prefrence and network calls', () => {

    cy.visitWithLogin('monitor');
    cy.wait(['@fetchServices', '@fetchDashboard']);

    ui.autocomplete.findByLabel('Dashboard').type(dashboardName);
    ui.autocompletePopper.findByTitle(dashboardName).click();

    ui.regionSelect.find().type(`${region}{enter}`);
    cy.wait('@fetchResources');

      mockGetLinodes([linodes[0]]);

      ui.autocomplete
      .findByLabel('Tags')
      .type('tag-2');

      ui.autocompletePopper
      .findByTitle('tag-2')
      .click();

      ui.autocomplete
       .findByLabel('Resources')
       .type(`${linodes[0].label}{enter}`)
       .click();

   // Expand the applied filters section
     ui.button.findByTitle('Filters').should('be.visible').click();

     // Verify that the applied filters
     cy.get('[data-qa-applied-filter-id="applied-filter"]')
       .should('be.visible')
       .within(() => {
         cy.get(`[data-qa-value="Region US, Chicago, IL"]`)
           .should('be.visible')
           .should('have.text', 'US, Chicago, IL');

           cy.get(`[data-qa-value="Resources ${linodes[0].label}"]`)
           .should('be.visible')
           .should('have.text', linodes[0].label);

 
       });
  });

  it('should correctly filter resources by tags, region, select tag "tag-2" and available resource should be linodeWithTagsTag2AndTag3', () => {
    cy.visitWithLogin('monitor');
    cy.wait(['@fetchServices', '@fetchDashboard']);

    ui.autocomplete.findByLabel('Dashboard').type(dashboardName);
    ui.autocompletePopper.findByTitle(dashboardName).click();

    ui.regionSelect.find().type(`${region}{enter}`);
    cy.wait('@fetchResources');

    ui.autocomplete.findByLabel('Resources').click();
    cy.get('[data-qa-autocomplete-popper="true"] ul')
      .children('li[data-qa-option="true"]')
      .should('have.length', 4)
      .and('have.text', 'Select All linodeWithTagsTag2AndTag3linodeWithTagsTag3AndTag4linodeNoTags');

    ui.autocomplete.findByLabel('Tags').type('tag-2');
    ui.autocompletePopper.findByTitle('tag-2').click();

    mockGetLinodes([linodes[0]]);
    ui.autocomplete.findByLabel('Resources').click();

    cy.get('[data-qa-autocomplete-popper="true"] ul')
      .children('li[data-qa-option="true"]')
      .should('have.length', 2)
      .and('have.text', 'Select All linodeWithTagsTag2AndTag3');
  });

  it('should correctly filter resources by tags, region, select tag "tag-3" and available resources should be linodeWithTagsTag2AndTag3, linodeWithTagsTag3AndTag4', () => {
    cy.visitWithLogin('monitor');
    cy.wait(['@fetchServices', '@fetchDashboard']);

    ui.autocomplete.findByLabel('Dashboard').type(dashboardName);
    ui.autocompletePopper.findByTitle(dashboardName).click();

    ui.regionSelect.find().type(`${region}{enter}`);
    cy.wait('@fetchResources');

    ui.autocomplete.findByLabel('Resources').click();
    cy.get('[data-qa-autocomplete-popper="true"] ul')
      .children('li[data-qa-option="true"]')
      .should('have.length', 4)
      .and('have.text', 'Select All linodeWithTagsTag2AndTag3linodeWithTagsTag3AndTag4linodeNoTags');

    ui.autocomplete.findByLabel('Tags').type('tag-3');
    ui.autocompletePopper.findByTitle('tag-3').click();

    mockGetLinodes([linodes[0], linodes[1]]);
    ui.autocomplete.findByLabel('Resources').click();

    cy.get('[data-qa-autocomplete-popper="true"] ul')
      .children('li[data-qa-option="true"]')
      .should('have.length', 3)
      .and('have.text', 'Select All linodeWithTagsTag2AndTag3linodeWithTagsTag3AndTag4');
  });

  it('add extra tag and verify resource', () => {
    cy.visitWithLogin('monitor');
    cy.wait(['@fetchServices', '@fetchDashboard']);

    ui.autocomplete.findByLabel('Dashboard').type(dashboardName);
    ui.autocompletePopper.findByTitle(dashboardName).click();

    ui.regionSelect.find().type(`${region}{enter}`);
    cy.wait('@fetchResources');

    ui.autocomplete.findByLabel('Tags').type('tag-2');
    ui.autocompletePopper.findByTitle('tag-2').click();

    mockGetLinodes([linodes[0]]);
    ui.autocomplete.findByLabel('Resources').type(`${linodes[0].label}{enter}`).click();

    ui.autocomplete.findByLabel('Tags').scrollIntoView().type('tag-4');
    ui.autocompletePopper.findByTitle('tag-4').click();

    ui.autocomplete.findByLabel('Tags').click(); // closing autocomplete

    cy.findByPlaceholderText("Select Resources")
      .should('have.value', ''); 

     // Expand the applied filters section
     ui.button.findByTitle('Filters').should('be.visible').click();

     // Verify that the applied filters
     cy.get('[data-qa-applied-filter-id="applied-filter"]')
       .should('be.visible')
       .within(() => {
         cy.get(`[data-qa-value="Region US, Chicago, IL"]`)
           .should('be.visible')
           .should('have.text', 'US, Chicago, IL');
 
           cy.get('[data-qa-value="Tags tag-2"]')
           .should('be.visible')
           .should('have.text', 'tag-2');
 
           cy.get('[data-qa-value="Tags tag-4"]')
           .should('be.visible')
           .should('have.text', 'tag-4');
 
       });
  });

  it('delete tag-2 and add tag-4 tag and verify resource', () => {

    cy.visitWithLogin('monitor');
    cy.wait(['@fetchServices', '@fetchDashboard']);

    ui.autocomplete.findByLabel('Dashboard').type(dashboardName);
    ui.autocompletePopper.findByTitle(dashboardName).click();

    ui.regionSelect.find().type(`${region}{enter}`);
    cy.wait('@fetchResources');

    ui.autocomplete
     .findByLabel('Tags')
     .type('tag-2');
    
    ui.autocompletePopper
    .findByTitle('tag-2')
    .click();

    mockGetLinodes([linodes[0]]);

    ui.autocomplete
    .findByLabel('Resources')
    .type(`${linodes[0].label}{enter}`)
    .click();

    cy.get('button[aria-label="Clear"]').eq(1).click();

    ui.autocomplete
     .findByLabel('Tags')
     .type('tag-4');
    
    ui.autocompletePopper
    .findByTitle('tag-4')
    .click();

    ui.autocomplete
    .findByLabel('Tags')
    .click(); // closing autocomplete

    cy.findByPlaceholderText("Select Resources")
      .should('have.value', ''); 

  // Expand the applied filters section
     ui.button.findByTitle('Filters').should('be.visible').click();

     // Verify that the applied filters
     cy.get('[data-qa-applied-filter-id="applied-filter"]')
       .should('be.visible')
       .within(() => {
         cy.get(`[data-qa-value="Region US, Chicago, IL"]`)
           .should('be.visible')
           .should('have.text', 'US, Chicago, IL');
 
           cy.get('[data-qa-value="Tags tag-4"]')
           .should('be.visible')
           .should('have.text', 'tag-4');
 
       });
  });


  it('selecting multiple resources, applying multiple tags, and verify that the resource selections are updated correctly based on the applied filters.', () => {

    cy.visitWithLogin('monitor');

    cy.wait(['@fetchServices', '@fetchDashboard']);

    ui.autocomplete
    .findByLabel('Dashboard')
    .type(dashboardName);

    ui.autocompletePopper
    .findByTitle(dashboardName)
    .click();

    ui.regionSelect
    .find()
    .type(`${region}{enter}`);

    cy.wait('@fetchResources');


    mockGetLinodes([linodes[0],linodes[1]]);

    ui.autocomplete
    .findByLabel('Resources')
    .type(`${linodes[0].label}{enter}`)
    .click();

    ui.autocomplete
    .findByLabel('Resources')
    .type(`${linodes[1].label}{enter}`)
    .click();


    ui.autocomplete
     .findByLabel('Tags')
     .type('tag-2');
    
    ui.autocompletePopper
    .findByTitle('tag-2')
    .click();

    ui.autocomplete
     .findByLabel('Tags')
     .type('tag-4');
    
    ui.autocompletePopper
    .findByTitle('tag-4')
    .click();

    ui.autocomplete
    .findByLabel('Tags')
    .click(); // closing autocomplete

    cy.findByPlaceholderText("Select Resources")
      .should('have.value', ''); 

  // Expand the applied filters section
     ui.button.findByTitle('Filters').should('be.visible').click();

     // Verify that the applied filters
     cy.get('[data-qa-applied-filter-id="applied-filter"]')
       .should('be.visible')
       .within(() => {
         cy.get(`[data-qa-value="Region US, Chicago, IL"]`)
           .should('be.visible')
           .should('have.text', 'US, Chicago, IL');
 
           cy.get('[data-qa-value="Tags tag-4"]')
           .should('be.visible')
           .should('have.text', 'tag-4');
 
       });
  });



  
});
