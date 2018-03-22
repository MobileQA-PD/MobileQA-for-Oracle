
define(['ojs/ojcore', 'knockout', 'jquery', 'appController',
    'ojs/ojknockout', 'ojs/ojbutton'],
        function (oj, ko, $, app)
        {

            function buttonModel() {
                var self = this;
                self.app = app;
                self.headerConfig = {'viewName': 'header', 'viewModelFactory': app.getHeaderModel()};
                var getTranslation = oj.Translations.getResource;
                self.buttonManageMember = ko.observable(getTranslation("button.managemember"));

                self.buttonClick = function (data, event) {
                    self.app.router.go('manage-members');

                    return true;
                }
            }
            return new buttonModel();

        });
