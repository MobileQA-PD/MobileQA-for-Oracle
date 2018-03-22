//
//  ViewController.m
//  CrashSample
//
//  Created by 이승우 on 2018. 3. 17..
//  Copyright © 2018년 이승우. All rights reserved.
//

#import "ViewController.h"
#import <CrashReportLib/CrashReport.h>

@interface ViewController ()
@property (weak, nonatomic) IBOutlet UITextField *textUserId;
@property (weak, nonatomic) IBOutlet UIButton *buttonCrash;
@property (weak, nonatomic) IBOutlet UILabel *textMessage;
@end

@implementation ViewController
- (void)saveCloudId:(NSString *)cloudId {
    NSString* path = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    [cloudId writeToFile:[NSString stringWithFormat:@"%@/%@", path, @"cloud_id.txt"] atomically:YES encoding:NSUTF8StringEncoding error:nil];
}

- (NSString *) loadCloudId {
    NSString* path = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    return [NSString stringWithContentsOfFile:[NSString stringWithFormat:@"%@/%@", path, @"cloud_id.txt"] encoding:NSUTF8StringEncoding error:nil];
}


- (void)viewDidLoad {
    [super viewDidLoad];
    
    [_buttonCrash setEnabled:false];
    
    NSString *cloudId = [self loadCloudId];
    NSLog(@"SAVED ID:%@", cloudId);
    
    if (cloudId != nil && ![cloudId isEqualToString:@""]) {
        [CrashReport setCrashReport:cloudId];
        [_textUserId setText:cloudId];
        [_buttonCrash setEnabled:true];
    }
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)onClickInitialize:(id)sender {
    [_textMessage setText:@""];
    
    if (_textUserId.text == nil || [_textUserId.text isEqualToString:@""]) {
        [_textMessage setText:@"Input Cloud ID"];
    }
    else {
        [self saveCloudId:_textUserId.text];
        [CrashReport setCrashReport:_textUserId.text];
        
        [_buttonCrash setEnabled:true];
    }
}

- (IBAction)onClickCrash:(id)sender {
    [_textMessage setText:@""];
    
    if (_textUserId.text == nil || [_textUserId.text isEqualToString:@""]) {
        [_textMessage setText:@"Input Cloud ID And Initialize"];
        [_buttonCrash setEnabled:false];
    }
    else {
        NSException *e = [NSException
                          exceptionWithName:@"FileNotFoundException"
                          reason:@"File Not Found on System"
                          userInfo:nil];
        
        @throw e;
    }
}

@end
