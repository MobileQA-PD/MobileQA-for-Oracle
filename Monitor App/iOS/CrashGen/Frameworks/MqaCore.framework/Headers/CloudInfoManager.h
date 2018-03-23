//
//  CloudInfoManager.h
//  MqaCore
//
//  Created by 이승우 on 2018. 3. 14..
//  Copyright © 2018년 이승우. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface CloudInfoManager : NSObject
+ (void) getCloudInfo:(NSString *)id
     CompletionHander:(void (^)(NSMutableDictionary *data))completionHandler;


    
    
+ (void) saveCloudInfo:(NSString *)id info:(NSMutableDictionary *)info;
+ (NSMutableDictionary *) loadCloudInfo:(NSString *)id;
+ (NSString *) getBodyString:(NSString *)id;
@end
