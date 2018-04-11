//
//  ViewController.m
//  SDKSample
//
//  Created by 이승우 on 2018. 4. 11..
//  Copyright © 2018년 이승우. All rights reserved.
//

#import "ViewController.h"
#import <UserFeedback/UserFeedback.h>
@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)onClickFeedback:(id)sender {
    
    // Show Feedback
    [UserFeedback showFeedback];
}

- (IBAction)onClickMakeCrash:(id)sender {
    @throw [NSException exceptionWithName:@"Sample Exception"
                                   reason:@"MQA Sample Exception"
                                 userInfo:nil];
}

@end
