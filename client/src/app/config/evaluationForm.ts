export const EVALUATION_FORM={
            questions: [
               
                {
                    type: "matrix",
                    name: "Quality",
                    title: "Please indicate if you agree or disagree with the following statements",
                    columns: [
                        {
                            value: 1,
                            text: "Strongly Disagree"
                        }, {
                            value: 2,
                            text: "Disagree"
                        }, {
                            value: 3,
                            text: "Neutral"
                        }, {
                            value: 4,
                            text: "Agree"
                        }, {
                            value: 5,
                            text: "Strongly Agree"
                        }
                    ],
                    rows: [
                        {
                            value: "affordable",
                            text: "Product is affordable"
                        }, {
                            value: "does what it claims",
                            text: "Product does what it claims"
                        }, {
                            value: "better then others",
                            text: "Product is better than other products on the market"
                        }, {
                            value: "easy to use",
                            text: "Product is easy to use"
                        }
                    ]
                }, {
                    type: "rating",
                    name: "satisfaction",
                    title: "How satisfied are you with the Product?",
                    isRequired: true,
                    mininumRateDescription: "Not Satisfied",
                    maximumRateDescription: "Completely satisfied"
                }, {
                    type: "rating",
                    name: "recommend friends",
                    visibleIf: "{satisfaction} > 3",
                    title: "How likely are you to recommend the Product to a friend or co-worker?",
                    mininumRateDescription: "Will not recommend",
                    maximumRateDescription: "I will recommend"
                }, {
                    type: "comment",
                    name: "suggestions",
                    title: "What would make you more satisfied with the Product?"
                }
            ]
};